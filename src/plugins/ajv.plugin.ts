import Ajv from "ajv";
import addFormats from "ajv-formats";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { ValidationError } from "../utils/errors";

const ajvPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Create a new instance of Ajv
  const ajv = new Ajv({
    removeAdditional: true, // remove additional properties
    useDefaults: true, // replace missing properties with default values
    coerceTypes: true, // change data type of data to match type keyword
    allErrors: true, // check all rules before reporting errors
    strictTypes: false, // Don't fail on invalid types
  });

  // Add formats like email, uri, uuid, etc.
  addFormats(ajv);

  // Custom error formatter for AJV validation errors
  const errorFormatter = (errors: any[], dataVar: string) => {
    const errorMessages = errors.map((error) => {
      const field =
        error.instancePath.replace(/^\//, "") ||
        error.params.missingProperty ||
        "field";
      const message = error.message || "is invalid";
      return `${field} ${message}`;
    });

    return new ValidationError(
      `Validation error(s): ${errorMessages.join(", ")}`
    );
  };

  // Replace the default schema validator with our custom one
  fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    const validate = ajv.compile(schema);
    return (data) => {
      const valid = validate(data);
      if (!valid) {
        return { error: errorFormatter(validate.errors || [], "data") };
      }
      return { value: data };
    };
  });

  // Add custom formats if needed
  ajv.addFormat("phone", /^\+?[1-9]\d{1,14}$/);
};

export default fp(ajvPlugin);
