import { HttpService } from "@nestjs/axios";
import { FactoryProvider } from "@nestjs/common";

import { HttpClientService } from "./axios-http-client.service";
import { HttpClient } from "./http-client.interface";
import { HTTP_CLIENT } from "./http-client.token";

import { AsyncContext, CONTEXT_ALS } from "@module/common/context";

export const httpClientProvider: FactoryProvider<HttpClient> = {
  provide: HTTP_CLIENT,
  useFactory: (als: AsyncContext, client: HttpService) => new HttpClientService(als, client),
  inject: [CONTEXT_ALS, HttpService],
};
