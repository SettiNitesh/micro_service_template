const headers = {
  $id: "request-headers",
  type: "object",
  required: ["x-channel-id"],
  properties: {
    Authorization: { type: "string" },
    "x-channel-id": {
      type: "string",
      default: "WEB",
      enum: ["WEB"],
      description: "Example values: 'WEB'",
    },
  },
};

export const commonRequestSchemas = [headers];
