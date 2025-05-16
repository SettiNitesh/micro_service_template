import { POSTGRES_DB_ERRORS } from '../constants';
import CustomError from '../custom.error';

const postgressError = (error: any) => {
  if (error.code && POSTGRES_DB_ERRORS[error.code as keyof typeof POSTGRES_DB_ERRORS]) {
    const { statusCode, errorCode } =
      POSTGRES_DB_ERRORS[error.code as keyof typeof POSTGRES_DB_ERRORS];
    const detail = error.detail || error.stack;
    const fieldName = error.column;
    return CustomError.create({
      httpCode: statusCode,
      message: detail,
      property: fieldName,
      code: errorCode
    });
  }
  return undefined;
};

export default postgressError;
