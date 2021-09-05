import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import ImageUploadButton from "src/components/ImageUploadButton";

import { removeDashAndUppercaseFirstLetter } from "src/utils";

import MainController from "./MainController";
import ControllerSelection from "./ControllerSelection";

import useController, { methodTypes, spatialAlgorithms } from "./useController";

import { ControllerProps } from "./types";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(2),
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

  const fieldList =
    state.methodType === "spatial-resolution"
      ? [
          <ControllerSelection
            label="Algorithm"
            onChange={onChangeTextField("spatial-algorithm")}
            value={state.spatialAlgorithm}
            defaultValue={8}
          >
            {spatialAlgorithms.map((spatialAlgorithm) => (
              <MenuItem key={spatialAlgorithm} value={spatialAlgorithm} dense>
                {removeDashAndUppercaseFirstLetter(spatialAlgorithm)}
              </MenuItem>
            ))}
          </ControllerSelection>,
          <TextField
            label="Width"
            onChange={onChangeTextField("width")}
            required
            size="small"
            type="number"
            value={state.width}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />,
          <TextField
            label="Height"
            onChange={onChangeTextField("height")}
            required
            size="small"
            type="number"
            value={state.height}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />,
        ]
      : state.methodType === "gray-level-resolution"
      ? [
          <ControllerSelection
            label="Bit"
            onChange={onChangeTextField("bit")}
            value={state.bit}
            defaultValue={8}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
              <MenuItem key={value} value={value} dense>
                {value}
              </MenuItem>
            ))}
          </ControllerSelection>,
        ]
      : null;

  const renderForm = (
    <Grid container spacing={1} wrap="nowrap">
      <Grid item>
        <ControllerSelection
          label="Method"
          onChange={onChangeMethodType}
          value={state.methodType}
        >
          {methodTypes.map((methodType, i) => (
            <MenuItem key={`${methodType}i${i}`} value={methodType} dense>
              {methodType
                ? removeDashAndUppercaseFirstLetter(methodType)
                : "None"}
            </MenuItem>
          ))}
        </ControllerSelection>
      </Grid>
      {fieldList?.map((component, i) => (
        <Grid key={i} item>
          {component}
        </Grid>
      ))}
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
        {items.length === 0 ? (
          <Box padding={1}>
            <ImageUploadButton
              label="Please Select Image"
              disabled={isLoading}
              onChange={onImageUploadButtonChange}
            />
          </Box>
        ) : (
          <>
            <Box display="flex" margin={1} marginBottom={2}>
              {renderForm}
            </Box>
            <MainController
              numOfItems={items.length}
              disabledAdd={!isAddable}
              showRemove={items.length > 1}
              source={state.source}
              onChangeSource={onChangeTextField("source")}
              onClickAdd={onClickAdd}
              onClickClear={onClearAllItems}
              onClickRemove={onRemoveLastItem}
            />
          </>
        )}
      </AppBar>
    </Container>
  );
};

export default Controller;
