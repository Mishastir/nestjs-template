import { AsyncLocalStorage } from "async_hooks";

export type Key = "trace" | "protocol" | "event" | "ip";
export type ContextMap = Map<Key, string>;
export type AsyncContext = AsyncLocalStorage<ContextMap>;
