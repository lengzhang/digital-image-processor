import React, { useMemo } from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Image from "./Image";

import { ImageItem } from "src/hooks/useImageItems";

import useImageBlock from "./useImageBlock";

interface ImageBlockProps {
  index: number;
  item: ImageItem;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ index, item }) => {
  const {
    title,
    subtitle,
    showSource,
    onClickSource,
    showHistogram,
    onClickHistogram,
    resultTitle,
    sourceTitle,
    source,
  } = useImageBlock({ index, item });

  const sourceButton = useMemo(() => {
    return (
      <Button
        onClick={onClickSource}
        variant="outlined"
        color={showSource ? "primary" : "secondary"}
        size="small"
      >
        {showSource ? "Showing" : "Hiding"} Source
      </Button>
    );
  }, [showSource, onClickSource]);

  const histogramButton = useMemo(() => {
    return (
      <Button
        onClick={onClickHistogram}
        variant="outlined"
        color={showHistogram ? "primary" : "secondary"}
        size="small"
      >
        {showHistogram ? "Showing" : "Hiding"} Histogram
      </Button>
    );
  }, [showHistogram, onClickHistogram]);

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
            <Grid item container spacing={1}>
              {source !== null && <Grid item>{sourceButton}</Grid>}
              <Grid item>{histogramButton}</Grid>
            </Grid>
          </Grid>
        </Box>
        <Divider light variant="fullWidth" />
        <Box display="flex" flexWrap="no-wrap" style={{ overflowX: "auto" }}>
          <Image
            title={resultTitle}
            imageItem={item}
            showHistogram={showHistogram}
          />
          {source !== null && showSource && (
            <Image
              title={sourceTitle}
              imageItem={source}
              showHistogram={showHistogram}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default React.memo(ImageBlock);
