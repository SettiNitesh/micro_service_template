export const commonErrorSchema = {
  type: 'object',
  properties: {
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          code: { type: 'string' }
        }
      }
    }
  }
};

export const validationErrorSchema = {
  type: 'object',
  properties: {
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          property: { type: 'string' },
          ...commonErrorSchema.properties.errors.items.properties
        }
      }
    }
  }
};

export const errorSchemas: { [key: number]: unknown } = {
  400: validationErrorSchema,
  401: commonErrorSchema,
  403: commonErrorSchema,
  404: commonErrorSchema,
  405: commonErrorSchema,
  415: commonErrorSchema,
  409: commonErrorSchema,
  429: commonErrorSchema,
  500: commonErrorSchema,
  502: commonErrorSchema,
  504: commonErrorSchema
};
