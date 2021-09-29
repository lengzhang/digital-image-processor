import React, { useMemo } from "react";

import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import ImageCanvas from "src/components/common/ImageCanvas";

import { removeDashAndUppercaseFirstLetter } from "src/utils";
import { Pixel } from "src/utils/imageDataUtils";

import useImageItems, { ImageItem } from "src/hooks/useImageItems";

interface ImageBlockProps {
  index: number;
  item: ImageItem;
}

interface Item {
  text: string;
  matrix: Pixel[][];
  imageItem: ImageItem;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ index, item }) => {
  const { state } = useImageItems();

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

  return (
    <Box>
      <Paper>
        <Box padding={2}>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Divider light variant="fullWidth" />
        <Box display="flex" flexWrap="no-wrap" style={{ overflowX: "auto" }}>
          {list.map(({ text, matrix, imageItem }, i) => (
            <Box key={i} margin={2}>
              <Box maxWidth={600} maxHeight={600} overflow="auto">
                <ImageCanvas matrix={matrix} />
              </Box>
              <Typography display="block" noWrap>
                {text}
              </Typography>
              <Typography display="block" noWrap>
                Bit: {imageItem.bit}-bit
              </Typography>
              <Typography display="block" noWrap>
                Gray Scaled: {imageItem.isGrayScaled.toString()}
              </Typography>
              {imageItem.type === "bit-planes-removing" && (
                <Typography display="block" noWrap>
                  Bit Planes:{" "}
                  {imageItem.bits.toString(2).padStart(imageItem.bit, "0")}
                </Typography>
              )}
              {imageItem.type === "histogram-equalization" &&
                !!imageItem.heMode && (
                  <Typography display="block" noWrap>
                    HE Mode: {imageItem.heMode}
                  </Typography>
                )}
              {imageItem.type === "spatial-filtering" && (
                <>
                  <Typography display="block" noWrap>
                    Filter Mode: {imageItem.method}
                  </Typography>
                  {(imageItem.method === "smoothing-filter" ||
                    imageItem.method === "median-filter" ||
                    imageItem.method === "high-boosting-filter") && (
                    <Typography display="block" noWrap>
                      Filter Kernel Size: {imageItem.filterSize}x
                      {imageItem.filterSize}
                    </Typography>
                  )}
                  {imageItem.method === "smoothing-filter" && (
                    <Typography display="block" noWrap>
                      σ (Sigma): {imageItem.sigma}
                    </Typography>
                  )}
                  {imageItem.method === "sharpening-laplacian-filter" && (
                    <Typography display="block" noWrap>
                      Mask Mode: {imageItem.maskMode}
                    </Typography>
                  )}
                  {imageItem.method === "high-boosting-filter" && (
                    <Typography display="block" noWrap>
                      A: {imageItem.highBoostingA}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ImageBlock;
