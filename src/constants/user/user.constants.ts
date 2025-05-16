import { DatabaseTable } from "../../types";

export const USER: DatabaseTable = {
  NAME: "user",
  COLUMNS: {
    USER_ID: "user_id",
    FIRST_NAME: "first_name",
    LAST_NAME: "last_name",
    MOBILE_NUMBER: "mobile_number",
    EMAIL_ADDRESS: "email_address",
    ALTERNATE_MOBILE_NUMBER: "alternate_mobile_number",
    IS_MOBILE_NUMBER_VERIFIED: "is_mobile_number_verified",
    IS_EMAIL_ADDRESS_VERIFIED: "is_email_address_verified",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
  },
};
