// eslint-disable-next-line import/no-named-as-default
import PinoPretty, { PrettyOptions } from "pino-pretty";

const magenta = (str: string): string => `\x1b[35m${str}\x1b[0m`;
const yellow = (str: string): string => `\x1b[33m${str}\x1b[0m`;
const blue = (str: string): string => `\x1b[34m${str}\x1b[0m`;
const cyan = (str: string): string => `\x1b[36m${str}\x1b[0m`;
const red = (str: string): string => `\x1b[31m${str}\x1b[0m`;
const white = (str: string): string => `\x1b[37m${str}\x1b[0m`;
const green = (str: string): string => `\x1b[32m${str}\x1b[0m`;

/*
const colors = [magenta, yellow, blue, cyan, red, white, green];

const getColorByAnyNumber = (n: number): ((str: string) => string) => {
  const i = n % colors.length;
  return colors.at(i);
};

const firstCharToHex = (str: string): string => (str ? str.charCodeAt(0).toString(16) : "0");
*/
const prepareTrace = (trace?: string): string => (trace ? `🤖${magenta(`[${trace}]`)} ` : "");
const prepareErrorMessage = (message?: string): string => (message ? `${red(message)}` : "");
const prepareProtocol = (protocol?: string): string => (protocol ? `🚢${magenta(`[${protocol}]`)} ` : "");
const prepareArrow = (action: string): string => {
  if (!action) return "";
  if (action === "start") return "🔽 ";
  if (action === "end") return "🔼 ";
  if (action === "output") return "▶ ";
  if (action === "input") return "◀ ";
  return "";
};

const levels = {
  10: `🟣${magenta("TRACE")}`,
  20: `🔵${blue("DEBUG")}`,
  30: `🟢${green("INFO")}`,
  40: `🟠${yellow("WARN")}`,
  50: `🔴${red("ERROR")}`,
  60: `⚫${red("FATAL")}`,
};
type Log = { ctx: string; data: Record<string, string>; debug: Record<string, string>; err: Record<string, string> };
module.exports = (opt: PrettyOptions) =>
  PinoPretty({
    ...opt,
    translateTime: true,
    colorize: true,
    singleLine: true,
    messageKey: "message",
    hideObject: false,
    customPrettifiers: {
      time: (timestamp) => `[🕰 ${timestamp}]`,
      pid: (name) => magenta(name.toString()),
      hostname: (name) => magenta(name.toString()),
      level: (level: string | object) => levels[level.toString()],
    },
    include: "time,message,level,object,data,debug,ctx",
    errorLikeObjectKeys: ["err"],
    messageFormat: (log, messageKey) => {
      const message = log[messageKey] as string;

      const {
        data,
        debug: { trace, protocol },
        err,
      } = log as Log;
      if (data) {
        const { query, action, nanos } = data;
        const sqlLog = query ? `\n 🔎 ${yellow((query as string).trim())}\n` : "";
        const arrow = prepareArrow(action);
        const ms = nanos ? yellow(` ${+nanos / 1_000_000}ms`) : "";
        return `${prepareTrace(trace)}${prepareProtocol(protocol)}${arrow}${cyan(message)}${sqlLog}${ms}`;
      }
      if (err) {
        const { message: errorMessage, stack, action } = err;
        const stackLog = stack ? `\n${white(stack)}\n` : "";

        const messageLog = prepareErrorMessage(errorMessage || message);
        const arrow = prepareArrow(action);
        const readyToLog = `${prepareTrace(trace)}${prepareProtocol(protocol)}${arrow}${messageLog}${stackLog}`;
        return readyToLog;
      }

      return cyan(message);
    },
  });
