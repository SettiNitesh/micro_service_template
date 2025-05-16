import CustomError from "../custom.error";

const unstructuredError = (error: any) => {
  if (error.fieldName && (error.message || error.detail)) {
    return CustomError.create({
      httpCode: error.code || 400,
      message: error.message || error.detail,
      property: error.fieldName,
      code: "UNSTRUCTURED_ERROR",
    });
  }
  return undefined;
};

export default unstructuredError;
