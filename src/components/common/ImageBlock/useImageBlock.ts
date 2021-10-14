import { useCallback, useMemo, useState } from "react";

import useImageItems, { ImageItem } from "src/hooks/useImageItems";

import { removeDashAndUppercaseFirstLetter } from "src/utils";

interface UseImageBlockProps {
  index: number;
  item: ImageItem;
}

const useImageBlock = ({ index, item }: UseImageBlockProps) => {
  const { state } = useImageItems();

  const [showSource, setShowSource] = useState(true);
  const [showHistogram, setShowHistogram] = useState(false);

  const onClickSource = useCallback(() => {
    setShowSource(!showSource);
  }, [showSource]);

  const onClickHistogram = useCallback(() => {
    setShowHistogram(!showHistogram);
  }, [showHistogram]);

  const [source, sourceTitle] = useMemo(() => {
    const s = state.items.find((_, i) => i === item.source) ?? null;
    if (s === null) return [null, ""];
    const m = s.matrix.length;
    const n = s.matrix[0].length;
    return [s, `Source[${item.source}] (${m} x ${n})`];
  }, [state.items, item.source]);

  const resultTitle = useMemo(() => {
    const m = item.matrix.length;
    const n = item.matrix[0].length;
    return `${index === 0 ? "" : "Result"} (${m} x ${n})`;
  }, [index, item]);

  const [title, subtitle] = useMemo(() => {
    if (item.type === "original") {
      return [removeDashAndUppercaseFirstLetter(item.type), item.filename];
    }

    const method =
      "method" in item ? removeDashAndUppercaseFirstLetter(item.method) : "";

    return [
      `[${index}] ${removeDashAndUppercaseFirstLetter(item.type)}`,
      method,
    ];
  }, [index, item]);

  return {
    title,
    subtitle,
    showSource,
    onClickSource,
    showHistogram,
    onClickHistogram,
    resultTitle,
    sourceTitle,
    source,
  };
};

export default useImageBlock;
