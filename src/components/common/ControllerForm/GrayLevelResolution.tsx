import React from "react";

import { Field } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import SelectField from "src/components/common/SelectField";

import useStyles from "./useStyles";
import { DefaultFieldsProps } from "./types";

const bitItems = [1, 2, 3, 4, 5, 6, 7, 8].map((v) => ({
  value: `${v}`,
  text: `${v}`,
}));

const GrayLevelResolution: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Field
        allowNull
        name="bit"
        component={SelectField}
        items={bitItems}
        textFieldProps={{
          className: classes.textField,
          disabled,
          label: "Bit",
          variant: "outlined",
          required: true,
          size: "small",
          SelectProps: { autoWidth: true },
        }}
      />
    </Grid>
  );
};

export default React.memo(GrayLevelResolution);
