import React from "react";

import { Field } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import InputField from "src/components/common/InputField";
import SelectField from "src/components/common/SelectField";

import useImageItems from "src/hooks/useImageItems";

import useStyles from "../useStyles";
import { DefaultFieldsProps, SelectionItem } from "../types";

const HighBoostingFilter: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();

  const { state } = useImageItems();

  const sourceItems = React.useMemo(
    () =>
      state.items.map<SelectionItem>((_, i) => ({
        value: `${i}`,
        text: `${i === 0 ? "Original" : i}`,
      })),
    [state.items]
  );

  return (
    <>
      <Grid item>
        <Field
          allowNull
          name="high-boosting-filter-blurred-image"
          component={SelectField}
          items={sourceItems}
          textFieldProps={{
            className: classes.textField,
            disabled,
            label: "Blurred Image",
            variant: "outlined",
            required: true,
            size: "small",
            SelectProps: { autoWidth: true },
          }}
        />
      </Grid>
      <Grid item>
        <Field
          allowNull
          name="high-boosting-filter-k"
          component={InputField}
          textFieldProps={{
            className: classes.textField,
            label: "k (k >= 1)",
            required: true,
            size: "small",
            type: "number",
          }}
          validate={(value, _, meta) => {
            if (meta?.dirty) {
              const num = parseFloat(value);
              if (num < 1) return "k must be greater than or equal 1.";
            }
          }}
        />
      </Grid>
    </>
  );
};

export default React.memo(HighBoostingFilter);
