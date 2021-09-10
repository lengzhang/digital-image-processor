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
        text: `Source (${source.matrix[0].length} x ${source.matrix.length})`,
        matrix: source.matrix,
      });
    }
    newList.push({
      text: `${index === 0 ? "" : "Result"} (${item.matrix[0].length} x ${
        item.matrix.length
      })`,
      matrix: item.matrix,
    });
    return newList;
  }, [index, item.matrix, source]);

  const title = useMemo(
    () =>
      (index === 0 ? "" : `[${index}] `) +
      removeDashAndUppercaseFirstLetter(item.type) +
      (item.type === "spatial-resolution"
        ? `: ${removeDashAndUppercaseFirstLetter(item.method)}`
        : ""),
    [index, item]
  );

  const subheader1 = useMemo(
    () =>
      item.type === "spatial-resolution"
        ? source !== undefined
          ? `Source: ${item.source === 0 ? "Original" : `[${item.source}]`}(${
              source.matrix[0].length
            } x ${source.matrix.length})`
          : undefined
        : undefined,
    [item, source]
  );

  const subheader2 = useMemo(
    () =>
      item.type === "spatial-resolution"
        ? `Result: [${index}](${item.width} x ${item.height})`
        : item.type === "gray-level-resolution"
        ? `Result: ${item.bit}-bit`
        : undefined,
    [item, index]
  );

  return (
    <Box>
      <Paper>
        <Box padding={2}>
          <Typography variant="h6">{title}</Typography>
          {subheader1 && (
            <Typography component={Box} paddingTop={2} variant="subtitle2">
              {subheader1}
            </Typography>
          )}
          {subheader2 && (
            <Typography component={Box} paddingTop={2} variant="subtitle2">
              {subheader2}
            </Typography>
          )}
        </Box>
        <Divider light variant="fullWidth" />
        <Box display="flex" flexWrap="no-wrap" style={{ overflowX: "auto" }}>
          {list.map(({ text, matrix }, i) => (
            <Box key={i} margin={2}>
              <Typography display="block" noWrap>
                {text}
              </Typography>
              <Box maxWidth={600} maxHeight={600} overflow="auto">
                <ImageCanvas matrix={matrix} />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ImageBlock;

/*
<Card>
      <CardHeader title={title} subheader={subheader} />
      <CardContent
        component={Box}
        overflow="auto"
        maxWidth="100%"
        maxHeight={720}
      >
        <Grid container spacing={4} wrap="nowrap" justifyContent="center">
          {!!source && (
            <Grid item xs={12} md={6}>
              <Paper style={{ height: "100%" }}>
                <Box
                  padding={1}
                  display="flex"
                  flexDirection="column"
                  height="100%"
                >
                  <Typography display="block">
                    Source ({source.matrix[0].length} x {source.matrix.length})
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    padding={1}
                    overflow="auto"
                    height="100%"
                  >
                    <ImageCanvas matrix={source.matrix} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Paper style={{ height: "100%" }}>
              <Box
                padding={1}
                display="flex"
                flexDirection="column"
                height="100%"
              >
                <Typography display="block">
                  {index === 0 ? "Original" : "Result"} ({item.matrix[0].length}{" "}
                  x {item.matrix.length})
                </Typography>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  padding={1}
                  overflow="auto"
                  height="100%"
                >
                  <ImageCanvas matrix={item.matrix} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    */
