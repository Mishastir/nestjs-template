import { AsyncLocalStorage } from "async_hooks";

import { ExecutionContext } from "@nestjs/common";

import { ContextInterceptor } from "./context.interceptor";
import { ContextMap } from "./context.type";

const getDataMock = jest.fn().mockReturnThis();
const getContextMock = jest.fn().mockReturnThis();
const handleMock = jest.fn();

const executionContext: Partial<ExecutionContext> = {
  switchToRpc: () => ({ getData: getDataMock, getContext: getContextMock }),
};
const callHandler = { handle: handleMock };

const als = new AsyncLocalStorage<ContextMap>();
const intercepts = new ContextInterceptor(als);

describe("test context interceptor", () => {
  test("should be defined", () => {
    expect(intercepts).toBeDefined();
  });

  test("intercept", () => {
    getDataMock.mockReturnValueOnce({});
    getContextMock.mockReturnValueOnce({ args: ["MOCK_EVENT"] });
    callHandler.handle.mockResolvedValueOnce("next");

    intercepts.intercept(executionContext as ExecutionContext, callHandler);

    expect(getDataMock).toHaveBeenCalled();

    expect(getContextMock).toHaveBeenCalled();

    expect(handleMock).toHaveBeenCalled();

    const storage = als.getStore();

    expect(storage).toBeDefined();

    const event = storage.get("event");

    const trace = storage.get("trace");
    const transport = storage.get("protocol");

    expect(event).toEqual("MOCK_EVENT");
    expect(transport).toEqual("rpc");
    expect(trace).toEqual(expect.any(String));
  });
});
