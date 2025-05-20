// fastify.d.ts
import { SupabaseClient } from '@supabase/supabase-js';
import amqp from 'amqplib';
import Bull, { Queue } from 'bull';
import 'fastify';
import { httpClientWrapper } from '../plugins/httpClient';
import {
  assertExchangeWrapper,
  assertQueueWrapper,
  bindQueueWrapper,
  channelConsumeWrapper,
  publishMessageWrapper,
  publishWrapper,
  sendEventDataToQueueWrapper
} from '../plugins/pubsub';
import { CreateTaskParams, TaskStatus } from './bull.types';

declare module 'fastify' {
  interface FastifyRequest {
    requestTime?: number;
    logTrace?: Record<string, string>;
  }

  interface FastifyInstance {
    knex: Knex;
    config: fastifyEnv.FastifyEnvOptions;
    supabase: SupabaseClient<any, 'public', any>;
    rabbitmq: {
      connection: amqp.ChannelModel;
      channel: amqp.Channel;
    };
    request: ReturnType<typeof httpClientWrapper>;
    publishMessage: ReturnType<typeof publishMessageWrapper>;
    sendEventDataToQueue: ReturnType<typeof sendEventDataToQueueWrapper>;
    assertExchange: ReturnType<typeof assertExchangeWrapper>;
    assertQueue: ReturnType<typeof assertQueueWrapper>;
    bindQueue: ReturnType<typeof bindQueueWrapper>;
    channelConsume: ReturnType<typeof channelConsumeWrapper>;
    publishEvent: ReturnType<typeof publishWrapper>;
    bullQueues: Record<string, Queue>;
    createBullTask: (params: CreateTaskParams) => Promise<Bull.Job>;
    getBullTask: (queueName: string, jobId: string | number) => Promise<Bull.Job | null>;
    getBullTaskStatus: (queueName: string, jobId: string | number) => Promise<TaskStatus | null>;
  }
}
