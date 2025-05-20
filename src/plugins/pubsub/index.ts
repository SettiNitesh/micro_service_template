import { ConsumeMessage, Options } from 'amqplib';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export const publishMessageWrapper = (fastify: FastifyInstance) => {
  return async ({
    exchange,
    routingKey,
    eventData,
    options
  }: {
    exchange: string;
    routingKey?: string;
    eventData: Buffer;
    options?: Options.Publish;
  }) => {
    try {
      const { channel } = fastify.rabbitmq;
      channel.publish(exchange, routingKey ?? '', eventData, options);
      fastify.log.info(`Message published to ${exchange} with routing key ${routingKey ?? ''}`);
    } catch (error) {
      fastify.log.error(error, 'ERROR PUBLISHING MESSAGE');
    }
  };
};

export const sendEventDataToQueueWrapper = (fastify: FastifyInstance) => {
  return async ({
    queue,
    eventData,
    options
  }: {
    queue: string;
    eventData: Buffer;
    options?: Options.Publish;
  }) => {
    try {
      const { channel } = fastify.rabbitmq;
      channel.sendToQueue(queue, eventData, options);
    } catch (error) {
      fastify.log.error(error, 'ERROR SENDING EVENT DATA TO QUEUE');
    }
  };
};

export const assertExchangeWrapper = (fastify: FastifyInstance) => {
  return async (
    exchange: string,
    options?: Options.AssertExchange,
    type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string = 'topic'
  ) => {
    try {
      const { channel } = fastify.rabbitmq;
      await channel.assertExchange(exchange, type, { ...options, durable: true });
    } catch (error) {
      fastify.log.error(error, 'ERROR ASSERTING EXCHANGE');
    }
  };
};

export const assertQueueWrapper = (fastify: FastifyInstance) => {
  return async (queue: string, options?: Options.AssertQueue) => {
    try {
      const { channel } = fastify.rabbitmq;
      const { queue: queueres } = await channel.assertQueue(queue, { ...options, durable: true });
      return queueres;
    } catch (error) {
      fastify.log.error(error, 'ERROR ASSERTING QUEUE');
    }
  };
};

export const bindQueueWrapper = (fastify: FastifyInstance) => {
  return async (queue: string, exchange: string, pattern: string) => {
    try {
      const { channel } = fastify.rabbitmq;
      await channel.bindQueue(queue, exchange, pattern);
    } catch (error) {
      fastify.log.error(error, 'ERROR BINDING QUEUE');
    }
  };
};

export const channelConsumeWrapper = (fastify: FastifyInstance) => {
  return async (queue: string, callback: (msg: ConsumeMessage | null) => void) => {
    try {
      const { channel } = fastify.rabbitmq;
      channel.consume(queue, async (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());
          console.log(`Received Message : ${JSON.stringify(content)}`);
          callback(content);
          channel.ack(msg);
        }
      });
    } catch (error) {
      fastify.log.error(error, 'ERROR CONSUMING MESSAGE');
    }
  };
};

const publishWrapper = (fastify: FastifyInstance) => {
  return async ({
    exchange,
    queue,
    bindqueue
  }: {
    exchange: string;
    queue: string;
    bindqueue: any;
  }) => {
    try {
      const assertExchange = assertExchangeWrapper(fastify);
      const assertQueue = assertQueueWrapper(fastify);
      const bindQueue = bindQueueWrapper(fastify);
      const channelConsume = channelConsumeWrapper(fastify);

      await assertExchange(exchange, { durable: true });

      const queuedetail = await assertQueue(queue, { durable: true });

      if (bindqueue) {
        bindqueue.forEach(async ({ exchange, pattern }: { exchange: string; pattern: string }) => {
          await bindQueue(queuedetail!, exchange, pattern);
        });
      }

      await channelConsume(queuedetail!, (msg) => {
        console.log(`Received Message : ${JSON.stringify(msg)}`);
      });

      return true;
    } catch (error) {
      fastify.log.error(error, 'ERROR PUBLISHING MESSAGE');
      return false;
    }
  };
};

const eventPlugin = async (fastify: FastifyInstance) => {
  // Decorate fastify with individual wrapper functions
  fastify.decorate('publishMessage', publishMessageWrapper(fastify));
  fastify.decorate('sendEventDataToQueue', sendEventDataToQueueWrapper(fastify));
  fastify.decorate('assertExchange', assertExchangeWrapper(fastify));
  fastify.decorate('assertQueue', assertQueueWrapper(fastify));
  fastify.decorate('bindQueue', bindQueueWrapper(fastify));
  fastify.decorate('channelConsume', channelConsumeWrapper(fastify));
  fastify.decorate('publishEvent', publishWrapper(fastify));
};

export default fp(eventPlugin, {
  name: 'fastify-pubsub',
  dependencies: ['fastify-rabbitmq']
});
