import { AsyncLocalStorage } from "async_hooks";

import { ValueProvider } from "@nestjs/common";

import { CONTEXT_ALS } from "./als.token";
import { ContextMap } from "./context.type";

export const contextALSProvider: ValueProvider<AsyncLocalStorage<ContextMap>> = {
  provide: CONTEXT_ALS,
  useValue: new AsyncLocalStorage<ContextMap>(),
};
