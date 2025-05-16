export const paginationSchema = {
  $id: "response-pagination",
  type: "object",
  properties: {
    current_page: { type: "integer" },
    page_size: { type: "integer" },
    total_items: { type: "integer" },
    total_pages: { type: "integer" },
  },
};

export const auditSchema = {
  $id: "response-audit",
  type: "object",
  nullable: true,
  properties: {
    api_version: { type: "string" },
    created_by: { type: "string" },
    created_at: { type: "string" },
    updated_by: { type: "string" },
    updated_at: { type: "string" },
  },
};

export const getUserinfoSchema = {
  $id: "get-user-info",
  type: "object",
  properties: {
    user_id: { type: "string" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    mobile_number: { type: "string" },
    alternate_mobile_number: { type: "string" },
    email_address: { type: "string" },
    is_email_verified: { type: "boolean" },
    is_mobile_number_verified: { type: "boolean" },
  },
};

export const commonResponseSchemas = [
  auditSchema,
  paginationSchema,
  getUserinfoSchema,
];
