export const removeDashAndUppercaseFirstLetter = (str: string) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const getClip = (x: number, min: number, max: number) =>
  x < min ? min : max < x ? max : x;

export const scrollToBottom = () => {
  const element = document?.getElementById("root");
  element?.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};
