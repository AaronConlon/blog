import consola from "consola";

export const info = (value: string) => {
  if (
    globalThis.localStorage &&
    globalThis.localStorage.getItem("debug") !== null
  ) {
    consola.info(value);
  } else {
    consola.info(value);
  }
};
