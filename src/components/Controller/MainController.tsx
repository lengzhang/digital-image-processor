import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import SelectField from "src/components/common/SelectField";

import { Field, useForm } from "react-final-form";

import { useAppDispatch, useAppSelector } from "src/redux/store";

import { actions } from "src/redux/reducer/imageItems";

interface MainControllerProps {
  disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: 120,
  },
}));

const MainController: React.FC<MainControllerProps> = ({ disabled }) => {
  const classes = useStyles();
  const items = useAppSelector((state) => state.imageItems.items);
  const dispatch = useAppDispatch();

  const formApi = useForm();

  React.useEffect(
    () => {
      formApi.reset({ source: items.length === 0 ? 0 : items.length - 1 });
    },
    // eslint-disable-next-line
    [items]
  );

  const onClearAllItems = () => {
    dispatch(actions.initialize());
  };

  const onRemoveLastItem = () => {
    dispatch(actions.popItem());
  };

  const sourceItems = React.useMemo(
    () =>
      items.map((_, i) => ({ value: `${i}`, text: i === 0 ? "Original" : i })),
    [items]
  );

  return (
    <>
      <Field
        name="source"
        component={SelectField}
        disabled={disabled}
        items={sourceItems}
        textFieldProps={{
          className: classes.select,
          label: "Source",
          variant: "outlined",
          required: true,
          size: "small",
          SelectProps: { autoWidth: true },
        }}
      />
      <Box marginLeft="auto">
        <Button
          color="primary"
          disabled={disabled}
          variant="outlined"
          type="submit"
        >
          ADD
        </Button>
      </Box>
      <Box marginLeft={1}>
        <Button
          disabled={disabled}
          variant="outlined"
          color="secondary"
          onClick={onClearAllItems}
        >
          Clear All
        </Button>
      </Box>
      <Box marginLeft={1} hidden={items.length <= 1}>
        <Button
          disabled={disabled}
          variant="outlined"
          color="secondary"
          onClick={onRemoveLastItem}
        >
          Remove Last
        </Button>
      </Box>
    </>
  );
};

export default MainController;
