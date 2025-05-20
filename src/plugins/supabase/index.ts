import { createClient } from '@supabase/supabase-js';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const supabasePlugin = async (fastify: FastifyInstance) => {
  try {
    const supabase = createClient(fastify.config.SUPABASE_URL, fastify.config.SUPABASE_ANON_KEY);
    fastify.decorate('supabase', supabase);
    fastify.log.info('SUPABASE CLIENT DECORATED & INITIALIZED');
  } catch (err) {
    fastify.log.error(err, 'ERROR CREATING SUPABASE CLIENT');
  }
};

export default fastifyPlugin(supabasePlugin);
