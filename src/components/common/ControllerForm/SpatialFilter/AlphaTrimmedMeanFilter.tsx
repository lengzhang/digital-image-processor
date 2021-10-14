import React from "react";

import { FieldValidator } from "final-form";
import { Field } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import InputField from "src/components/common/InputField";

import useStyles from "../useStyles";
import { DefaultFieldsProps } from "../types";

const kernelSizeValidation: FieldValidator<string> = (value, _, meta) => {
  if (meta?.dirty) {
    const num = parseFloat(value);
    if (num < 0 || !Number.isInteger(num) || num % 2 !== 1)
      return "Kernel size must be positive odd integer.";
  }
};
const dValidation: FieldValidator<string> = (value, allValues, meta) => {
  if (meta?.dirty) {
    const num = parseFloat(value);
    if (num < 0 || !Number.isInteger(num)) {
      return "d must be a positive integer.";
    }
  }
};

const AlphaTrimmedMeanFilter: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();

  return (
    <>
      <Grid item>
        <Field
          allowNull
          name="spatial-filter-size"
          component={InputField}
          textFieldProps={{
            className: classes.textField,
            disabled,
            label: "Kernel Size",
            required: true,
            size: "small",
            type: "number",
          }}
          validate={kernelSizeValidation}
        />
      </Grid>
      <Grid item>
        <Field
          allowNull
          name="alpha-trimmed-mean-filter-d"
          component={InputField}
          textFieldProps={{
            className: classes.textField,
            disabled,
            label: "d",
            required: true,
            size: "small",
            type: "number",
          }}
          validate={dValidation}
        />
      </Grid>
    </>
  );
};

export default AlphaTrimmedMeanFilter;
