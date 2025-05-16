import { LogTrace } from '../log';

export interface CreateUserParams {
  input: {
    first_name: string;
    last_name?: string;
    mobile_number: string;
    alternate_mobile_number: string;
    email_address: string;
    is_mobile_number_verified?: boolean;
    is_email_address_verified?: boolean;
  };
  logTrace: LogTrace;
}
