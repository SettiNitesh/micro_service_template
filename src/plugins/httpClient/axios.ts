import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import http from 'http';
import https from 'https';

// Define interfaces for the options and request parameters
interface HttpAgentOptions {
  keepAlive: boolean;
}

interface HttpClientParams {
  url: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: string;
}

// Http agent configuration
const httpHttpAgentOpts: HttpAgentOptions = {
  keepAlive: true
};

const httpHttpsAgentOpts: HttpAgentOptions = {
  keepAlive: true
};

// Create axios instance with default configuration
const client = axios.create({
  httpAgent: new http.Agent(httpHttpAgentOpts),
  httpsAgent: new https.Agent(httpHttpsAgentOpts),
  timeout: 10000
});

/**
 * HTTP client function that uses axios for making requests
 * @param params - The HTTP request parameters
 * @returns A promise that resolves to the axios response
 */
const httpClient = ({
  url,
  method,
  body,
  headers = {},
  timeout,
  responseType
}: HttpClientParams): Promise<AxiosResponse> => {
  // Build request config
  const config: AxiosRequestConfig = {
    url,
    method,
    ...(body && { data: body }),
    ...(headers && { headers }),
    ...(timeout && { timeout }),
    ...(responseType && { responseType })
  };

  return client(config);
};

export default httpClient;
