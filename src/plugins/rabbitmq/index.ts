import amqp from 'amqplib';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const rabbitmqPlugin = async (fastify: FastifyInstance) => {
  try {
    const connection = await amqp.connect(fastify.config.RABBITMQ_URL);

    const channel = await connection.createChannel();

    fastify.decorate('rabbitmq', {
      connection,
      channel
    });
    fastify.log.info('RABBITMQ CONNECTION & CHANNEL DECORATED');
  } catch (error) {
    fastify.log.error(error, 'ERROR CONNECTING TO RABBITMQ');
  }
};

export default fastifyPlugin(rabbitmqPlugin);
