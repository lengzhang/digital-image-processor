import { useCallback, useEffect, useMemo, useState } from "react";

import useImageItems, { ImageItem } from "src/hooks/useImageItems";

import { removeDashAndUppercaseFirstLetter } from "src/utils";
import { Pixel } from "src/utils/imageDataUtils";

const colors: ("R" | "G" | "B")[] = ["R", "G", "B"];

interface UseImageBlockProps {
  index: number;
  item: ImageItem;
}

interface Item {
  text: string;
  matrix: Pixel[][];
  imageItem: ImageItem;
}

interface Histogram {
  R: number[];
  G: number[];
  B: number[];
}

const useImageBlock = ({ index, item }: UseImageBlockProps) => {
  const { state } = useImageItems();

  const [showHistogram, setShowHistogram] = useState(false);

  const [histogram, setHistogram] = useState<Histogram | null>(null);

  useEffect(() => {
    const he = item.matrix.reduce<Histogram>(
      (acc, row) => {
        for (let pixel of row) {
          for (let color of colors) {
            if (0 <= pixel[color] || pixel[color] <= 255) {
              acc[color][pixel[color]]++;
            }
          }
        }
        return acc;
      },
      {
        R: Array.from<number>({ length: 255 }).fill(0),
        G: Array.from<number>({ length: 255 }).fill(0),
        B: Array.from<number>({ length: 255 }).fill(0),
      }
    );
    setHistogram(he);
  }, [item.matrix]);

  const onClickHistogram = useCallback(() => {
    setShowHistogram(!showHistogram);
  }, [showHistogram]);

  const source = useMemo(
    () => state.items.find((_, i) => i === item.source),
    [state.items, item.source]
  );

  const list = useMemo(() => {
    const newList: Item[] = [];
    if (!!source) {
      newList.push({
        text: `Source[${item.source}] (${source.matrix[0].length} x ${source.matrix.length})`,
        matrix: source.matrix,
        imageItem: source,
      });
    }
    newList.push({
      text: `${index === 0 ? "" : "Result"} (${item.matrix[0].length} x ${
        item.matrix.length
      })`,
      matrix: item.matrix,
      imageItem: item,
    });
    return newList;
  }, [index, item, source]);

  const title = useMemo(
    () =>
      (index === 0 ? "" : `[${index}] `) +
      removeDashAndUppercaseFirstLetter(item.type) +
      (item.type === "spatial-resolution"
        ? `: ${removeDashAndUppercaseFirstLetter(item.method)}`
        : ""),
    [index, item]
  );

  return { histogram, list, title, showHistogram, onClickHistogram };
};

export default useImageBlock;
