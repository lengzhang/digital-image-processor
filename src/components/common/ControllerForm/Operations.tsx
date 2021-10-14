import React, { useMemo } from "react";

import { Field, useFormState } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import SelectField from "src/components/common/SelectField";

import { OperationItem } from "src/hooks/useImageItems/useOperations";
import useImageItems from "src/hooks/useImageItems";

import { DefaultFieldsProps } from "./types";
import useStyles from "./useStyles";

const OperationMethodItems: {
  value: OperationItem["method"];
  text: string;
}[] = [
  { value: "addition", text: "Addition" },
  { value: "subtraction", text: "Subtraction" },
  { value: "scaling", text: "Scaling" },
];

const Operations: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();
  const values = useFormState().values;
  const { state } = useImageItems();
  const itemList = useMemo(
    () =>
      Array.from({ length: state.items.length }).map((_, i) => ({
        value: `${i}`,
        text: i === 0 ? "Original" : i,
      })),
    [state.items.length]
  );

  const fields = useMemo(() => {
    const item = OperationMethodItems.find(
      (m) => m.value === values["operations-method"]
    );
    if (item === undefined) return null;

    if (item.value === "addition" || item.value === "subtraction") {
      const type = item.value === "addition" ? "addend" : "minuend";
      return (
        <Grid item>
          <Field
            allowNull
            name={`operations-${type}`}
            component={SelectField}
            items={itemList}
            textFieldProps={{
              className: classes.selectField,
              disabled,
              label: type.replace(/\b\w/g, (c) => c.toUpperCase()),
              variant: "outlined",
              required: true,
              size: "small",
              SelectProps: { autoWidth: true },
            }}
          />
        </Grid>
      );
    }
    return null;
  }, [values, disabled, itemList, classes.selectField]);

  return (
    <>
      <Grid item>
        <Field
          allowNull
          name="operations-method"
          component={SelectField}
          items={OperationMethodItems}
          textFieldProps={{
            className: classes.selectField,
            disabled,
            label: "Type",
            variant: "outlined",
            required: true,
            size: "small",
            SelectProps: { autoWidth: true },
          }}
        />
      </Grid>
      {fields}
    </>
  );
};

export default React.memo(Operations);
