import { AsyncLocalStorage } from "async_hooks";

import { HttpService } from "@nestjs/axios";
import { Test } from "@nestjs/testing";
import { of, throwError } from "rxjs";

import { HttpClient } from "./http-client.interface";
import { httpClientProvider } from "./http-client.provider";
import { HTTP_CLIENT } from "./http-client.token";

import { CONTEXT_ALS } from "@module/common/context";
import { ServiceException } from "@module/common/exceptions";

describe("axios-http-client unit test", () => {
  let httpAxiosClient: HttpClient;

  describe("mock axios http service, return success values", () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          {
            provide: CONTEXT_ALS,
            useValue: new AsyncLocalStorage(),
          },

          {
            provide: HttpService,
            useValue: { request: jest.fn().mockImplementation(() => of({ status: 200, data: { mocked: "123" } })) },
          },
          httpClientProvider,
        ],
      }).compile();
      httpAxiosClient = moduleRef.get<HttpClient>(HTTP_CLIENT);
    });

    test("success test", async () => {
      const { ok, response } = await httpAxiosClient.requestMapToEither({ url: "", method: "POST" });

      expect(ok).toBe(true);
      expect(response).toEqual({ mocked: "123" });
    });
  });

  describe("mock axios http service, return failed values", () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          {
            provide: CONTEXT_ALS,
            useValue: new AsyncLocalStorage(),
          },

          {
            provide: HttpService,
            useValue: {
              request: jest.fn().mockImplementation(() => throwError({ status: 200, data: { mocked: "123" }, message: "123" })),
            },
          },
          httpClientProvider,
        ],
      }).compile();
      httpAxiosClient = moduleRef.get<HttpClient>(HTTP_CLIENT);
    });

    test("test fail client", async () => {
      const { ok, error } = await httpAxiosClient.requestMapToEither({ url: "", method: "POST" });

      expect(ok).toBe(false);
      expect(error).toBeInstanceOf(ServiceException);
      expect(error.message).toEqual("123");
      expect(error.code).toEqual("CLIENT_ERROR");
    });
  });

  describe("mock axios http service, return API error", () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          {
            provide: CONTEXT_ALS,
            useValue: new AsyncLocalStorage(),
          },

          {
            provide: HttpService,
            useValue: {
              request: jest
                .fn()
                .mockImplementation(() => throwError({ response: { data: {}, status: 400, statusText: "Bad Request" } })),
            },
          },
          httpClientProvider,
        ],
      }).compile();
      httpAxiosClient = moduleRef.get<HttpClient>(HTTP_CLIENT);
    });

    test("test fail client", async () => {
      const { ok, error } = await httpAxiosClient.requestMapToEither({ url: "", method: "POST" });

      expect(ok).toBe(false);
      expect(error).toBeInstanceOf(ServiceException);
      expect(error.message).toEqual("Http Exception");
      expect(error.code).toEqual("BAD_REQUEST");
      expect(error.category).toEqual("EXTERNAL_API");
    });
  });
});
