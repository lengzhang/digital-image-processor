import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Field, useForm } from "react-final-form";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import SelectField from "src/components/common/SelectField";

import useImageItems from "src/hooks/useImageItems";

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
  const {
    state: { items },
    initialize,
    popItem,
  } = useImageItems();

  const formApi = useForm();

  React.useEffect(() => {
    formApi.reset({ source: items.length === 0 ? 0 : items.length - 1 });
  }, [formApi, items]);

  const onClearAllItems = () => {
    initialize();
  };

  const onRemoveLastItem = () => {
    popItem();
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
        items={sourceItems}
        textFieldProps={{
          className: classes.select,
          disabled,
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
