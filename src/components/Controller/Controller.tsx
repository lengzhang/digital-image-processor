import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import LinearProgress from "@material-ui/core/LinearProgress";

import ImageUploadButton from "src/components/common/ImageUploadButton";

import ControllerForm from "./ControllerForm";
import useController from "./useController";
import { Form } from "react-final-form";

import MainController from "./MainController";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(2),
  },
  select: {
    minWidth: 120,
  },
  progress: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const Controller = () => {
  const classes = useStyles();

  const { disabled, items, onSubmit } = useController();

  return (
    <Container className={classes.container} maxWidth="lg">
      {items.length === 0 ? (
        <>
          <ImageUploadButton label="Please Select Image" disabled={disabled} />
          {disabled && (
            <Box marginTop={1}>
              <LinearProgress />
            </Box>
          )}
        </>
      ) : (
        <AppBar
          variant="outlined"
          color="default"
          position="relative"
          square={false}
        >
          <Form
            onSubmit={onSubmit}
            subscription={{ submitting: true, values: true }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Toolbar
                  variant="dense"
                  component={Box}
                  paddingTop={1}
                  paddingBottom={1}
                  overflow="auto"
                >
                  <ControllerForm disabled={disabled} items={items} />
                </Toolbar>
                <Toolbar
                  variant="dense"
                  component={Box}
                  paddingTop={1}
                  paddingBottom={1}
                >
                  <MainController disabled={disabled} />
                </Toolbar>
              </form>
            )}
          />
          {disabled && (
            <Box marginTop={1}>
              <LinearProgress />
            </Box>
          )}
        </AppBar>
      )}
    </Container>
  );
};

export default Controller;
