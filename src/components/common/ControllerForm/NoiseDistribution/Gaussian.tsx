import React from "react";

import { FieldValidator } from "final-form";
import { Field } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import InputField from "src/components/common/InputField";

import { DefaultFieldsProps } from "../types";
import useStyles from "../useStyles";

const validation: FieldValidator<string> = (value, _, meta) => {
  if (meta?.dirty) {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return "Please input a number";
  }
};

const Gaussian: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();

  return (
    <>
      <Grid item>
        <Field
          allowNull
          name="noise-distribution-gaussian-mean"
          component={InputField}
          textFieldProps={{
            className: classes.textField,
            disabled,
            label: "Mean",
            required: true,
            size: "small",
            type: "number",
          }}
          validate={validation}
        />
      </Grid>
      <Grid item>
        <Field
          allowNull
          name="noise-distribution-gaussian-sigma"
          component={InputField}
          textFieldProps={{
            className: classes.textField,
            disabled,
            label: "σ (sigma)",
            required: true,
            size: "small",
            type: "number",
          }}
          validate={validation}
        />
      </Grid>
      <Grid item>
        <Field
          allowNull
          name="noise-distribution-gaussian-k"
          component={InputField}
          textFieldProps={{
            className: classes.textField,
            disabled,
            label: "k (Strength Coefficient)",
            required: true,
            size: "small",
            type: "number",
          }}
          validate={validation}
        />
      </Grid>
    </>
  );
};

export default React.memo(Gaussian);
