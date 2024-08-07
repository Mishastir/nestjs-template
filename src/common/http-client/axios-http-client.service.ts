import { HttpService } from "@nestjs/axios";
import { HttpException, Inject, Injectable, Logger } from "@nestjs/common";
import type { AxiosRequestConfig } from "axios";
import { firstValueFrom } from "rxjs";

import { HttpClient } from "./http-client.interface";

import { AsyncContext, CONTEXT_ALS } from "@module/common/context";
import { ServiceException } from "@module/common/exceptions";

@Injectable()
export class HttpClientService implements HttpClient {
  private readonly logger = new Logger(HttpClientService.name);

  constructor(@Inject(CONTEXT_ALS) private readonly als: AsyncContext, private readonly axios: HttpService) {}
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const store = this.als?.getStore();

    const trace = store?.get("trace");
    const initHeaders = config?.headers;
    const headers = { ...initHeaders, trace };
    const { url } = config;
    this.logger.debug({ url, message: `http request ${url}` });
    const $response = this.axios.request({ ...config, headers });
    try {
      const response = await firstValueFrom($response);
      const { data, status } = response;
      this.logger.debug({ url, status, message: `http response ${url}` });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const { response } = err;
      if (!response) {
        this.logger.warn({ message: `http client error ${url}`, url });
        throw new ServiceException(err.message, "CLIENT_ERROR", "EXTERNAL_API", { url }, err);
      }
      const { data, status, statusText } = response;

      this.logger.warn({ message: `http response ${url}`, url, status, statusText });
      throw ServiceException.fromHttpException(new HttpException(data, status, { cause: data }), {
        statusText,
        url,
      });
    }
  }

  public async requestMapToEither<T>(
    config: AxiosRequestConfig,
  ): Promise<{ ok: boolean; response: T; error: ServiceException<Record<string, unknown>> }> {
    try {
      const response = await this.request<T>(config);
      return { ok: true, response, error: null };
    } catch (error) {
      return { ok: false, response: null, error: error as ServiceException<Record<string, unknown>> };
    }
  }
}
