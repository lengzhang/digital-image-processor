import React from "react";

import { Field } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import InputField from "src/components/common/InputField";
import SelectField from "src/components/common/SelectField";

import useStyles from "./useStyles";
import { DefaultFieldsProps, SelectionItem } from "./types";

const methodItems: SelectionItem[] = [
  {
    value: "nearest-neighbor-interpolation",
    text: "Nearest Neighbor Interpolation",
  },
  {
    value: "linear-interpolation-x",
    text: "Linear Interpolation (X Coordinate)",
  },
  {
    value: "linear-interpolation-y",
    text: "Linear Interpolation (Y Coordinate)",
  },
  { value: "bilinear-interpolation", text: "Bilinear Interpolation" },
];

const SpatialResolution: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();

  return (
    <>
      <Grid item>
        <Field
          allowNull
          name="method"
          component={SelectField}
          items={methodItems}
          textFieldProps={{
            className: classes.selectField,
            disabled,
            label: "Method",
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
          name="width"
          component={InputField}
          textFieldProps={{
            // className: classes.textField,
            disabled,
            label: "Width",
            required: true,
            size: "small",
            type: "number",
          }}
          validate={(value, _, meta) => {
            if (meta?.dirty) {
              const num = parseFloat(value);
              if (num < 0 || !Number.isInteger(num))
                return "Width must be positive integer.";
            }
          }}
        />
      </Grid>
      <Grid item>
        <Field
          allowNull
          name="height"
          component={InputField}
          textFieldProps={{
            className: classes.textField,
            disabled,
            label: "Height",
            required: true,
            size: "small",
            type: "number",
          }}
          validate={(value, _, meta) => {
            if (meta?.dirty) {
              const num = parseFloat(value);
              if (num < 0 || !Number.isInteger(num))
                return "Height must be positive integer.";
            }
          }}
        />
      </Grid>
    </>
  );
};

export default React.memo(SpatialResolution);
