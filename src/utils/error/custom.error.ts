import { STATUS_CODES, STATUS_TEXTS } from './constants';
import { formatDetail } from './helper';

class CustomError extends Error {
  constructor(httpCode: number, errors: any) {
    super();
    this._code = httpCode;
    this._errors = errors;
  }

  getErrorArr(errors: any) {
    if (!(errors || errors?.length)) {
      return [
        {
          message: STATUS_TEXTS[this._code as keyof typeof STATUS_TEXTS],
          code: STATUS_CODES[this._code as keyof typeof STATUS_CODES]
        }
      ];
    }
    return errors;
  }

  get code() {
    return this._code;
  }

  get response() {
    return {
      errors: this._errors
    };
  }

  static create({
    httpCode,
    message,
    property,
    code
  }: {
    httpCode: number;
    message: string;
    property?: string;
    code?: string;
  }) {
    const errors = [this.parse(message, property, code)];
    return new CustomError(httpCode, errors);
  }

  static parse(message: string, property?: string, code?: string) {
    return {
      message: formatDetail(message),
      ...(property && { property }),
      code
    };
  }
}

export default CustomError;
