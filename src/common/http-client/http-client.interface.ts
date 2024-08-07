import { AxiosRequestConfig } from "axios";

import { ServiceException } from "@module/common/exceptions";

export interface HttpClient {
  request<T>(input: AxiosRequestConfig): Promise<T>;
  requestMapToEither<T>(
    input: AxiosRequestConfig,
  ): Promise<{ ok: boolean; response: T; error: ServiceException<Record<string, unknown>> }>;
}
