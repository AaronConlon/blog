export const calcReverseColor = (colorValue: string | number) => {
  return Math.abs(`0x000000` - `0x${colorValue}`) >
    Math.abs(`0xffffff` - `0x${colorValue}`)
    ? "black"
    : "white";
};
