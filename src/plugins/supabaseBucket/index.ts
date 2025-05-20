import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const supabaseBucketPlugin = async (fastify: FastifyInstance) => {
  try {
    const supabase = fastify.supabase;

    const bucket = supabase.storage.createBucket(fastify.config.SUPABASE_BUCKET_NAME, {
      public: fastify.config.BUCKET_PUBLIC,
      allowedMimeTypes: fastify.config.BUCKET_ALLOWED_MIME_TYPES,
      fileSizeLimit: fastify.config.BUCKET_FILE_SIZE_LIMIT
    });

    fastify.decorate('supabaseBucket', bucket);
  } catch (err) {
    fastify.log.error(err, 'ERROR CREATING BUCKET Client');
  }
};

export default fastifyPlugin(supabaseBucketPlugin);
