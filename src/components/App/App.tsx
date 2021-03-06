import CssBaseline from "@material-ui/core/CssBaseline";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Controller from "src/components/Controller";
import ImageBlock from "src/components/common/ImageBlock";
import { MesssagesProvider } from "src/hooks/useMessages";

import useImageItems, { ImageItemsProvider } from "src/hooks/useImageItems";

const App = () => {
  const { state } = useImageItems();

  return (
    <>
      <Container maxWidth={false}>
        <Box paddingTop={2} paddingBottom={20}>
          <Grid container spacing={2} direction="column">
            {state.items.map((item, i) => (
              <Grid key={i} item component={Box} width="100%">
                <ImageBlock index={i} item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Controller />
    </>
  );
};

const AppWithProvider = () => {
  return (
    <>
      <CssBaseline />
      <MesssagesProvider>
        <ImageItemsProvider>
          <App />
        </ImageItemsProvider>
      </MesssagesProvider>
    </>
  );
};

export default AppWithProvider;
