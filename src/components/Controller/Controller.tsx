import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import ImageUploadButton from "src/components/ImageUploadButton";
import useController from "./useController";

import { ControllerProps } from "./types";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(2),
  },
  form: {
    flexGrow: 1,
  },
  select: {
    minWidth: 120,
  },
}));

const Controller: React.FC<ControllerProps> = ({
  isLoading,
  items,
  addItem,
  onClearAllItems,
  onImageUploadButtonChange,
  onRemoveLastItem,
}) => {
  const classes = useStyles();
  const {
    state,
    isAddable,
    onChangeMethodType,
    onChangeTextField,
    onClickAdd,
  } = useController({ items, addItem });

  const renderForm = (
    <Grid container spacing={1}>
      <Grid item>
        <TextField
          className={classes.select}
          label="Method"
          onChange={onChangeMethodType}
          required
          select
          size="small"
          value={state.methodType}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="scale">Scale</MenuItem>
        </TextField>
      </Grid>
      {state.methodType === "scale" && (
        <>
          <Grid item>
            <TextField
              label="Width"
              onChange={onChangeTextField("width")}
              required
              size="small"
              type="number"
              value={state.width}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Height"
              onChange={onChangeTextField("height")}
              required
              size="small"
              type="number"
              value={state.height}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );

  return (
    <Container className={classes.container} maxWidth="md">
      <AppBar
        variant="outlined"
        color="default"
        position="relative"
        square={false}
      >
        <Box display="flex" margin={1}>
          {items.length === 0 ? (
            <ImageUploadButton
              label="Please Select Image"
              disabled={isLoading}
              onChange={onImageUploadButtonChange}
            />
          ) : (
            <>
              <Box flexGrow={1}>{renderForm}</Box>
            </>
          )}
        </Box>
        {items.length > 0 && (
          <Box display="flex" margin={1} marginTop={0}>
            <Box marginLeft="auto">
              <Button
                color="primary"
                disabled={!isAddable}
                onClick={onClickAdd}
                variant="outlined"
              >
                ADD
              </Button>
            </Box>
            <Box marginLeft={1}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClearAllItems}
              >
                Clear
              </Button>
            </Box>
            {items.length > 1 && (
              <Box marginLeft={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onRemoveLastItem}
                >
                  Remove Last
                </Button>
              </Box>
            )}
          </Box>
        )}
      </AppBar>
    </Container>
  );
};

export default Controller;
