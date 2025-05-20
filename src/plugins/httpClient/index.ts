import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { CustomError } from '../../utils/error';
import httpClient from './axios';

const getTraceHeadersFromHeaders = (headers: string[]) => {
  const headerKeys = [
    'x-request-id',
    'x-b3-traceid',
    'x-b3-spanid',
    'x-b3-parentspanid',
    'x-b3-sampled',
    'x-ot-span-context',
    'x-b3-flags'
  ];

  return headerKeys.reduce(
    (logTrace, header) =>
      Object.assign(
        logTrace,
        headers[header as keyof typeof headers] && {
          [header]: headers[header as keyof typeof headers]
        }
      ),
    {}
  );
};

export const httpClientWrapper =
  (fastify: FastifyInstance) =>
  async ({
    url,
    path,
    method,
    body,
    headers = {},
    timeout,
    downstream_system,
    source_system,
    domain,
    functionality,
    response_type,
    exclude_response_data_logging = false
  }: {
    url: string;
    path?: string;
    method: string;
    body: unknown;
    headers: any;
    timeout: number;
    downstream_system?: string;
    source_system?: string;
    domain?: string;
    functionality?: string;
    response_type?: string;
    exclude_response_data_logging?: boolean;
  }) => {
    const common = {
      request: {
        url,
        method,
        data: body,
        path
      },
      log_trace: getTraceHeadersFromHeaders(headers),
      downstream_system,
      source_system,
      message: 'REST Request Context:',
      domain,
      functionality
    };

    fastify.log.info(common);

    try {
      const response = await httpClient({
        url,
        method,
        headers,
        body,
        timeout,
        responseType: response_type
      });

      fastify.log.info({
        ...common,
        response: {
          ...(!exclude_response_data_logging && { data: response.data }),
          status_code: response.status
        },
        message: 'REST Response Context:'
      });

      return response;
    } catch (error: any) {
      fastify.log.error({
        ...common,
        response: {
          error: error?.response?.data,
          status_code: error?.response?.status || 500,
          raw_error: error
        },
        message: 'REST Response Context:'
      });

      if (error?.response?.status) {
        throw CustomError.createHttpError({
          httpCode: error.response.status,
          errorResponse: error.response.data,
          downstream_system: downstream_system || 'unknown'
        });
      }

      throw error;
    }
  };

const httpClientPlugin = async (fastify: FastifyInstance) => {
  fastify.decorate('request', httpClientWrapper(fastify));
};

export default fastifyPlugin(httpClientPlugin);
