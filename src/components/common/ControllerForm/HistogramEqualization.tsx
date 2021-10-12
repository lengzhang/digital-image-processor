import React, { useMemo } from "react";

import { FieldValidator } from "final-form";
import { Field, useFormState } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import InputField from "src/components/common/InputField";
import SelectField from "src/components/common/SelectField";

import useStyles from "./useStyles";
import { DefaultFieldsProps, SelectionItem } from "./types";

const histogramEqualizationItems: SelectionItem[] = [
  { value: "global", text: "Global" },
  { value: "local", text: "Local" },
];

const validation: FieldValidator<string> = (value, _, meta) => {
  if (meta?.dirty) {
    const num = parseFloat(value);
    if (num < 0 || !Number.isInteger(num))
      return "Filter size must be positive integer.";
  }
};

const HistogramEqualization: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();
  const values = useFormState().values;

  const isLocal = useMemo(
    () => values?.["histogram-equalization-type"] === "local",
    [values]
  );

  return (
    <>
      <Grid item>
        <Field
          allowNull
          name="histogram-equalization-type"
          component={SelectField}
          items={histogramEqualizationItems}
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
      {isLocal && (
        <Grid item>
          <Field
            allowNull
            name="histogram-equalization-local-size"
            component={InputField}
            textFieldProps={{
              className: classes.textField,
              disabled,
              label: "Size",
              required: true,
              size: "small",
              type: "number",
            }}
            validate={validation}
          />
        </Grid>
      )}
    </>
  );
};

export default React.memo(HistogramEqualization);
