import React from "react";

import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import ImageCanvas from "src/components/common/ImageCanvas";

import { ImageItem } from "src/redux/reducer/imageItems";

import { useAppSelector } from "src/redux/store";

import { removeDashAndUppercaseFirstLetter } from "src/utils";
import { Pixel } from "src/utils/imageDataUtils";

interface ImageBlockProps {
  index: number;
  item: ImageItem;
}

interface Item {
  text: string;
  matrix: Pixel[][];
}

const ImageBlock: React.FC<ImageBlockProps> = ({ index, item }) => {
  const [list, setList] = React.useState<Item[]>([]);
  const source = useAppSelector((state) =>
    state.imageItems.items.find((_, i) => i === item.source)
  );

  React.useEffect(() => {
    const newList: Item[] = [];
    if (!!source) {
      newList.push({
        text: `Source (${source.matrix[0].length} x ${source.matrix.length})`,
        matrix: source.matrix,
      });
    }
    newList.push({
      text: `${index === 0 ? "Original" : "Result"} (${
        item.matrix[0].length
      } x ${item.matrix.length})`,
      matrix: item.matrix,
    });
    setList(newList);
  }, [index, item, source]);

  const title = React.useMemo(
    () =>
      (index === 0 ? "" : `[${index}] `) +
      removeDashAndUppercaseFirstLetter(item.type) +
      (item.type === "spatial-resolution"
        ? `: ${removeDashAndUppercaseFirstLetter(item.method)}`
        : ""),
    [index, item]
  );

  const subheader = React.useMemo(
    () =>
      item.type === "original"
        ? `(${item.matrix[0].length} x ${item.matrix.length})`
        : item.type === "spatial-resolution"
        ? (source !== undefined
            ? `(${source.matrix[0].length} x ${source.matrix.length}) => `
            : "") + `(${item.width} x ${item.height})`
        : item.type === "gray-level-resolution"
        ? `${item.bit}-bit`
        : undefined,
    [item, source]
  );

  return (
    <Box>
      <Paper>
        <Box padding={2}>
          <Typography variant="h6">{title}</Typography>
          <Typography component={Box} paddingTop={2} variant="subtitle2">
            {subheader}
          </Typography>
        </Box>
        <Divider light variant="fullWidth" />
        <Box display="flex" flexWrap="no-wrap" style={{ overflowX: "auto" }}>
          {list.map(({ text, matrix }, i) => (
            <Box key={i} margin={2}>
              <Typography display="block" noWrap>
                {text}
              </Typography>
              <Box maxHeight={600} overflow="auto">
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
