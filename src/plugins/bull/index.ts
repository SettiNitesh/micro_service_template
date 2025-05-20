import Bull, { JobOptions, Queue } from 'bull';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { RedisOptions } from 'ioredis';
import { CreateTaskParams, TaskData, TaskStatus } from '../../types';

const getJob = (queues: Record<string, Queue>) => {
  return async (queueName: string, jobId: string | number): Promise<Bull.Job | null> => {
    if (!queues[queueName]) {
      throw new Error(`Queue "${queueName}" not found`);
    }
    return await queues[queueName].getJob(jobId);
  };
};

const createHttpBullTask = ({
  fastify,
  queues,
  redis_config
}: {
  fastify: FastifyInstance;
  queues: Record<string, Queue>;
  redis_config: RedisOptions;
}) => {
  return async ({
    logTrace,
    url,
    queue,
    payload,
    delayInSeconds = 10,
    httpMethod = 'POST',
    headers = {},
    attempts = 3
  }: CreateTaskParams): Promise<Bull.Job> => {
    try {
      // Determine which queue to use

      const queueName = queue;

      // Get or create the queue if it doesn't exist

      if (!queues[queueName]) {
        queues[queueName] = new Bull(queueName, { redis: redis_config });

        // Add default processor for this queue

        queues[queueName].process(async (job: Bull.Job<TaskData>) => {
          const { url, httpMethod, headers, payload } = job.data;

          fastify.log.info({
            message: 'Processing Bull Task',
            log_trace: job.data.logTrace,
            task_id: job.id,
            queue: queueName,
            url
          });

          try {
            const response = await fastify.request({
              method: httpMethod,
              url,
              body: payload,
              headers: {
                'Content-Type': 'application/json',
                'X-Task-ID': job.id.toString(),
                'X-Queue-Name': queueName,
                ...headers
              },

              timeout: 10000
            });

            fastify.log.info({
              message: 'Bull Task Completed',
              log_trace: job.data.logTrace,
              task_id: job.id,
              status: response.status
            });

            return {
              data: response.data,
              status: response.status
            };
          } catch (error: unknown) {
            fastify.log.error({
              message: 'Bull Task Failed',
              log_trace: job.data.logTrace,
              task_id: job.id,
              error: error instanceof Error ? error.message : String(error)
            });
            throw error;
          }
        });
      }

      // Task data structure
      const taskData: TaskData = {
        logTrace,
        url,
        httpMethod,
        headers,
        payload
      };

      // Job options
      const jobOptions: JobOptions = {
        delay: delayInSeconds * 1000, // Convert to milliseconds
        attempts: attempts,
        backoff: {
          type: 'exponential',
          delay: 5000 // Start with 5 seconds delay
        }
      };

      fastify.log.info({
        message: 'Bull Task Request Details:',
        log_trace: logTrace,
        task_details: {
          queue: queueName,
          url,
          httpMethod,
          delay: delayInSeconds,
          payload
        }
      });

      // Add the job to the queue
      const job = await queues[queueName].add(taskData, jobOptions);

      fastify.log.info({
        message: 'Created Bull Task',
        log_trace: logTrace,
        response: {
          id: job.id,
          name: job.name || 'default',
          queue: queueName,
          timestamp: job.timestamp,
          delay: jobOptions.delay,
          attempts: jobOptions.attempts
        }
      });

      return job;
    } catch (err: any) {
      fastify.log.error({
        message: 'ERROR CREATING BULL TASK',
        log_trace: logTrace,
        error: err.message,
        stack: err.stack
      });
      throw err;
    }
  };
};

const getJobStatus = (queues: Record<string, Queue>) => {
  return async (queueName: string, jobId: string | number): Promise<TaskStatus | null> => {
    if (!queues[queueName]) {
      throw new Error(`Queue "${queueName}" not found`);
    }

    const job = await queues[queueName].getJob(jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();

    return {
      id: job.id,
      state,
      attempts: job.attemptsMade,
      data: job.data,
      createdAt: new Date(job.timestamp),
      processedAt: job.processedOn ? new Date(job.processedOn) : null,
      finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
      result: job.returnvalue
    };
  };
};

const bullTasksPlugin = async (fastify: FastifyInstance) => {
  try {
    // Get configuration with defaults
    const config = {
      redis: {
        port: 6379,
        host: '127.0.0.1'
      }
    };

    // Store queues in memory
    const queues: Record<string, Queue> = {};

    // Store queues in fastify instance for potential direct access
    fastify.decorate('bullQueues', queues);

    // Create and decorate the main function
    fastify.decorate(
      'createBullTask',
      createHttpBullTask({
        fastify,
        queues,
        redis_config: config.redis
      })
    );

    // Helper to get a job by id
    fastify.decorate('getBullTask', getJob(queues));

    // Helper to get job status
    fastify.decorate('getBullTaskStatus', getJobStatus(queues));
  } catch (err: any) {
    fastify.log.error(err, 'ERROR CREATING BULL TASK CLIENT');
    throw err;
  }
};

export default fp(bullTasksPlugin);
