import React, { useMemo } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import HistogramBarChart from "src/components/common/HistogramBarChart";
import ImageCanvas from "src/components/common/ImageCanvas";

import GeneralDetails from "./GeneralDetails";
import SpatialFilterDetails from "./SpatialFilterDetails";

import { ImageItem } from "src/hooks/useImageItems";

import { generateHistograms } from "src/utils";
import { colors } from "src/utils/constants";

const Image: React.FC<{
  title: string;
  imageItem: ImageItem;
  showHistogram: boolean;
}> = ({ imageItem, title, showHistogram }) => {
  const histograms = useMemo(() => {
    const hes = generateHistograms(imageItem.matrix);
    if (imageItem.isGrayScaled) {
      return (
        <HistogramBarChart
          label="Histogram Gray"
          data={hes?.R ?? null}
          color="GRAY"
        />
      );
    }
    return colors.map((color) => (
      <HistogramBarChart
        key={color}
        label={`Histogram ${color}`}
        data={hes?.[color] ?? null}
        color={color}
      />
    ));
  }, [imageItem.matrix, imageItem.isGrayScaled]);

  return (
    <Box margin={2} display="flex" flexDirection="column">
      <Box overflow="auto">
        <ImageCanvas matrix={imageItem.matrix} />
      </Box>
      <GeneralDetails text={title} {...imageItem} />
      {imageItem.type === "bit-planes-removing" && (
        <Typography display="block" noWrap>
          Bit Planes: {imageItem.bits.toString(2).padStart(imageItem.bit, "0")}
        </Typography>
      )}
      {"heMode" in imageItem && (
        <Typography display="block" noWrap>
          HE Mode: {imageItem.heMode}
        </Typography>
      )}
      {imageItem.type === "spatial-filtering" && (
        <SpatialFilterDetails item={imageItem} />
      )}
      {imageItem.type === "operation" &&
        (("addend" in imageItem && (
          <Typography display="block" noWrap>
            Addend:{" "}
            {imageItem.addend === 0 ? "Original" : `[${imageItem.addend}]`}
          </Typography>
        )) ||
          ("minuend" in imageItem && (
            <Typography display="block" noWrap>
              Minuend:{" "}
              {imageItem.minuend === 0 ? "Original" : `[${imageItem.minuend}]`}
            </Typography>
          )))}
      {showHistogram && <Box marginTop="auto">{histograms}</Box>}
    </Box>
  );
};

export default React.memo(Image);
