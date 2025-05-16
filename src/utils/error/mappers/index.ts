import basic from "./basic";
import paramsValidation from "./params.validation";
import postgressError from "./postgress.error";
import unstructuredError from "./unstructured.error";

export const DEFAULT_MAPPERS = [
  basic,
  paramsValidation,
  postgressError,
  unstructuredError,
];

export { basic, paramsValidation, postgressError, unstructuredError };
