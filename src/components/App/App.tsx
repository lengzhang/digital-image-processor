import CssBaseline from "@material-ui/core/CssBaseline";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Controller from "src/components/Controller";
import ImageBlock from "src/components/common/ImageBlock";

import useApp from "./useApp";

const App = () => {
  const { items } = useApp();

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box marginTop={2} marginBottom={20}>
          <Grid container spacing={2} direction="column">
            {items.map((item, i) => (
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

export default App;
