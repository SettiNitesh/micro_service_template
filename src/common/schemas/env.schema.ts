const schema = {
  type: 'object',
  properties: {
    DB_USER: {
      type: 'string',
      default: 'postgres'
    },
    DB_PASSWORD: {
      type: 'string',
      default: 'mysecretpassword'
    },
    DB_NAME: {
      type: 'string',
      default: 'postgres'
    },
    DB_HOST: {
      type: 'string',
      default: 'localhost'
    },
    DB_PORT: {
      type: 'number',
      default: 5432
    },
    SUPABASE_URL: {
      type: 'string',
      default: 'https://your-supabase-url.supabase.co'
    },
    SUPABASE_ANON_KEY: {
      type: 'string',
      default: 'your_supabase_anon_key'
    },
    SUPABASE_BUCKET_NAME: {
      type: 'string',
      default: 'bucket'
    },
    RABBITMQ_URL: {
      type: 'string',
      default: 'amqp://localhost:5672'
    }
  }
};

export default schema;
