export const calcReverseColor = (colorValue: string | number) => {
  // @ts-ignore
  return Math.abs(0x000000 - `0x${colorValue}`) >
    // @ts-ignore
    Math.abs(0xffffff - `0x${colorValue}`)
    ? "black"
    : "white";
};
