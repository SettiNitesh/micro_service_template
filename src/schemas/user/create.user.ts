import { errorSchemas } from "../../common";

const createUser = {
  tags: ["USER"],
  summary: "This API is to create a user",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "first_name",
      "mobile_number",
      "alternate_mobile_number",
      "email_address",
    ],
    additionalProperties: false,
    properties: {
      first_name: { type: "string" },
      last_name: { type: "string" },
      mobile_number: { type: "string" },
      alternate_mobile_number: { type: "string" },
      email_address: { type: "string" },
    },
  },
  response: {
    201: { $ref: "get-user-info#" },
    ...errorSchemas,
  },
};

export default createUser;
