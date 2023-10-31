import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

import { LoggerRpcInterceptor } from "./logger.interceptor";

const getDataMock = jest.fn().mockReturnThis();
const getContextMock = jest.fn().mockReturnThis();
const handleMock = jest.fn().mockImplementation(() => new Observable());

const executionContext: Partial<ExecutionContext> = {
  switchToRpc: () => ({ getData: getDataMock, getContext: getContextMock }),
};
const callHandler = { handle: handleMock };

describe("test context interceptor", () => {
  test("should be defined", () => {
    const interceptor: LoggerRpcInterceptor = new LoggerRpcInterceptor();
    expect(interceptor).toBeDefined();
  });

  test("intercept", () => {
    const interceptor: LoggerRpcInterceptor = new LoggerRpcInterceptor();
    getDataMock.mockReturnValueOnce({});
    getContextMock.mockReturnValueOnce({ args: ["MOCK_EVENT"] });

    interceptor.intercept(executionContext as ExecutionContext, callHandler);
    expect(handleMock).toHaveBeenCalled();
  });
});
