import CustomError from '../custom.error';

const basic = (error: any) => {
  if (error instanceof CustomError) {
    return error;
  }
  return undefined;
};

export default basic;
