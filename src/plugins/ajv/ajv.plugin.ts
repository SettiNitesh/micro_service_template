import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import AjvKeywords from 'ajv-keywords';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { commonRequestSchemas } from '../../common/schemas/request.schema';
import { commonResponseSchemas } from '../../common/schemas/response.schema';

const defaultAjvSettings: any = {
  removeAdditional: false, // remove additional properties
  useDefaults: true, // replace missing properties with default values
  coerceTypes: true, // change data type of data to match type keyword
  allErrors: true // check all rules before reporting errors
};

const defaultKeywords = ['transform', 'uniqueItemProperties'];

const validateSchema =
  (ajv: Ajv) =>
  ({ schema, data, key }: { schema: object; data: unknown; key: string }) => {
    let validate = ajv.getSchema(key);

    if (!validate) {
      ajv.addSchema(schema, key);
      validate = ajv.getSchema(key);
    }

    if (!validate?.(data)) {
      return { success: false, errors: validate?.errors };
    }

    return { success: true };
  };

const ajvPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  {
    settings = defaultAjvSettings,
    keywords = defaultKeywords
  }: { settings?: any; keywords?: string[] }
) => {
  // adding common schema in fastify
  const addFastifySchema = (mod: FastifyInstance | Ajv) => {
    [...commonRequestSchemas, ...commonResponseSchemas].forEach((schema) => {
      mod.addSchema(schema);
    });
  };

  try {
    const ajv = new Ajv(settings);
    AjvKeywords(ajv, keywords);
    AjvErrors(ajv);
    addFormats(ajv);
    addFastifySchema(fastify);
    addFastifySchema(ajv);
    fastify.decorate('validateSchema', validateSchema(ajv));
    fastify.setValidatorCompiler(({ schema }) => {
      return ajv.compile(schema);
    });
    // Add custom formats if needed
    ajv.addFormat('phone', /^\+?[1-9]\d{1,14}$/);
  } catch (err) {
    fastify.log.error(err);
    fastify.log.error('AJV compilation failed');
    throw Error(`AJV compilation failed ${err}`);
  }
};

export default fp(ajvPlugin);
