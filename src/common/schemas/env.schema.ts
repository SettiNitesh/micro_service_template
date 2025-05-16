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
    }
  }
};

export default schema;
