import React from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import ImageCanvas from "src/components/common/ImageCanvas";

import { ImageItem } from "src/hooks/useImageItems";

import HistogramBarChart from "src/components/common/HistogramBarChart";

import useImageBlock from "./useImageBlock";

const colors: ("R" | "G" | "B")[] = ["R", "G", "B"];

interface ImageBlockProps {
  index: number;
  item: ImageItem;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ index, item }) => {
  const { histogram, list, title, subtitle, showHistogram, onClickHistogram } =
    useImageBlock({
      index,
      item,
    });

  return (
    <Box>
      <Paper>
        <Box padding={2}>
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Typography variant="h6">{title}</Typography>
              {subtitle && (
                <Typography variant="subtitle2">{subtitle}</Typography>
              )}
            </Grid>
            <Grid item>
              <Button
                onClick={onClickHistogram}
                variant="outlined"
                color={showHistogram ? "primary" : "secondary"}
                size="small"
              >
                {showHistogram ? "Showing" : "Hiding"} Histogram
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Divider light variant="fullWidth" />
        <Box display="flex" flexWrap="no-wrap" style={{ overflowX: "auto" }}>
          {list.map(({ text, matrix, imageItem }, i) => (
            <Box key={i} margin={2}>
              <Box overflow="auto">
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
                  {(imageItem.method === "gaussian-smoothing-filter" ||
                    imageItem.method === "median-filter") && (
                    <Typography display="block" noWrap>
                      Filter Kernel Size: {imageItem.filterSize}x
                      {imageItem.filterSize}
                    </Typography>
                  )}
                  {imageItem.method === "gaussian-smoothing-filter" && (
                    <>
                      <Typography display="block" noWrap>
                        K: {imageItem.K}
                      </Typography>
                      <Typography display="block" noWrap>
                        σ (Sigma): {imageItem.sigma}
                      </Typography>
                    </>
                  )}
                  {imageItem.method === "sharpening-laplacian-filter" && (
                    <>
                      <Typography display="block" noWrap>
                        Mask Mode: {imageItem.maskMode}
                      </Typography>
                      <Typography display="block" noWrap>
                        Process Mode: {imageItem.processMode}
                      </Typography>
                    </>
                  )}
                  {imageItem.method === "high-boosting-filter" && (
                    <>
                      <Typography display="block" noWrap>
                        Blurred Image: {imageItem.blurredImage}
                      </Typography>
                      <Typography display="block" noWrap>
                        k: {imageItem.highBoostingK}
                      </Typography>
                    </>
                  )}
                </>
              )}
            </Box>
          ))}
        </Box>
        {showHistogram && (
          <Grid component={Box} container wrap="nowrap" spacing={1} padding={1}>
            {item.isGrayScaled ? (
              <Grid item xs={4}>
                <HistogramBarChart
                  label="Histogram Gray"
                  data={histogram?.R ?? null}
                  color="GRAY"
                />
              </Grid>
            ) : (
              colors.map((color) => (
                <Grid key={color} item xs={4}>
                  <HistogramBarChart
                    label={`Histogram ${color}`}
                    data={histogram?.[color] ?? null}
                    color={color}
                  />
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default ImageBlock;
