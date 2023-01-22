import consola from "consola";

export const info = (...args: unknown[]) => {
  if (
    globalThis.localStorage &&
    globalThis.localStorage.getItem("debug") !== null
  ) {
    consola.info(args);
  } else {
    consola.info(args);
  }
};
