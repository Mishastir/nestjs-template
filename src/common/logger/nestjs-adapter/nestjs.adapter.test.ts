import { pino } from "pino";

import { NestJsLoggerAdapter } from "./nestjs.adapter";

/* eslint-disable @typescript-eslint/no-explicit-any */

const logger = pino({
  level: "info",
  messageKey: "message",
});

const mockInfo = jest.fn();
const mockError = jest.fn();
const mockWarn = jest.fn();
const mockDebug = jest.fn();
const mockTrace = jest.fn();

const fakePino = {
  info: mockInfo,
  error: mockError,
  warn: mockWarn,
  debug: mockDebug,
  trace: mockTrace,
};

describe("Nestjs logger adapter unit test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test("Create instance", () => {
    const adapter = new NestJsLoggerAdapter(logger);

    expect(adapter).toBeDefined();
  });

  test("Test log message -> send single string -> should map string to str and call as second param", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.log("hello");
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: {}, ctx: "NoContext" }, "hello");
  });
  test("Test log message -> send double string -> should map string to str, send use for ctx", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.log("hello", "123");
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: {}, ctx: "123" }, "hello");
  });

  test("Test log message -> send empty -> should return default", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    (adapter as any).log();
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: {}, ctx: "NoContext" }, "NoContext");
  });

  test("Test log message -> send single object -> should not find any result for message and log default ctx", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.log({ 1: 2 });
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: { 1: 2 }, ctx: "NoContext" }, "NoContext");
  });

  test("Test log message -> send object with message field -> should  find message in object and use for second arg, first w/o message", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.log({ 1: 2, message: "message" });
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: { 1: 2 }, ctx: "NoContext" }, "message");
  });

  test("Test log message -> send null with message field -> should use ctx message and ctx object", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.log(null);
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: {}, ctx: "NoContext" }, "NoContext");
  });
  test("Test log message -> send 2 null with message field -> should use ctx message and ctx object", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.log(null, null);
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: {}, ctx: "NoContext" }, "NoContext");
  });

  test("Test log message -> send 1 arg as message, 2 as null -> should use message", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.log("hello", null);
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: {}, ctx: "NoContext" }, "hello");
  });

  test("Test log message -> send 1 arg as object, 2 as message -> should use object first, second as ctx and message", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.log({ 1: 2 }, "hello");
    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith({ data: { 1: 2 }, ctx: "hello" }, "hello");
  });

  test("Test debug -> should use debug", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.debug(12321312);
    expect(mockDebug).toHaveBeenCalledTimes(1);
  });

  test("Test debug -> should use debug", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.debug(12321312);
    expect(mockDebug).toHaveBeenCalledTimes(1);
  });

  test("Test verbose -> should use trace", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.verbose(12321312);
    expect(mockTrace).toHaveBeenCalledTimes(1);
  });

  test("Test warn -> should use warn", () => {
    const adapter = new NestJsLoggerAdapter(fakePino);
    adapter.warn(12321312);
    expect(mockWarn).toHaveBeenCalledTimes(1);
  });

  describe("test error", () => {
    test("Test error -> should use error", () => {
      const adapter = new NestJsLoggerAdapter(fakePino);
      adapter.error(new Error("12313"));
      expect(mockError).toHaveBeenCalledTimes(1);
    });

    test("Test error -> send error instance -> should show message and stack", () => {
      const adapter = new NestJsLoggerAdapter(fakePino);
      adapter.error(new Error("12313"));
      expect(mockError).toHaveBeenCalledTimes(1);

      expect(mockError).toHaveBeenCalledWith(
        { err: { message: "12313", name: expect.any(String), stack: expect.any(String) }, ctx: "NoContext" },
        "12313",
      );
    });
    test("Test error -> send object with message -> should show message in err field", () => {
      const adapter = new NestJsLoggerAdapter(fakePino);
      adapter.error({ message: "1" });
      expect(mockError).toHaveBeenCalledTimes(1);

      expect(mockError).toHaveBeenCalledWith({ err: { message: "1" }, ctx: "NoContext" }, "1");
    });
    test("Test error -> send object without message -> should use object in err field", () => {
      const adapter = new NestJsLoggerAdapter(fakePino);
      adapter.error({ random: "value" });
      expect(mockError).toHaveBeenCalledTimes(1);

      expect(mockError).toHaveBeenCalledWith({ err: { random: "value" }, ctx: "NoContext" }, "error");
    });

    test("Test error -> send string -> should use empty object and string as message", () => {
      const adapter = new NestJsLoggerAdapter(fakePino);
      (adapter as any).error("123312312");
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith({ err: {}, ctx: "NoContext" }, "123312312");
    });
    test("Test error -> send empty -> should use empty object and error message", () => {
      const adapter = new NestJsLoggerAdapter(fakePino);
      (adapter as any).error();
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith({ err: {}, ctx: "NoContext" }, "error");
    });
  });
});
