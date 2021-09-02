import CssBaseline from "@material-ui/core/CssBaseline";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Controller from "src/components/Controller";
import Image from "src/components/Image";

import useApp from "./useApp";

const App = () => {
  const {
    status,
    items,
    onSelectImage,
    onClearAllItems,
    onRemoveLastItem,
    addItem,
  } = useApp();

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box marginTop={2} marginBottom={17}>
          <Grid container spacing={2} direction="column">
            {items.map((item, i) => (
              <Grid key={i} item component={Box} width="100%">
                <Image title={item.title} imageData={item.imageData} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Controller
        isLoading={status === "loading"}
        items={items}
        onImageUploadButtonChange={onSelectImage}
        onClearAllItems={onClearAllItems}
        onRemoveLastItem={onRemoveLastItem}
        addItem={addItem}
      />
    </>
  );
};

export default App;
