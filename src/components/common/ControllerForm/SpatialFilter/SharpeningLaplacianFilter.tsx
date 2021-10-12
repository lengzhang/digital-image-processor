import React from "react";

import { Field } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import RadioField, { RadioFieldItem } from "src/components/common/RadioField";
import SelectField from "src/components/common/SelectField";

import useStyles from "../useStyles";
import { DefaultFieldsProps, SelectionItem } from "../types";

const sharpeningLaplacianFilterMaskModeItems: SelectionItem[] = [
  { value: "mask-4", text: "Mask 4" },
  { value: "mask-8", text: "Mask 8" },
  { value: "mask-4-reverse", text: "Mask 4 Reverse" },
  { value: "mask-8-reverse", text: "Mask 8 Reverse" },
];

const sharpeningLaplacianFilterProcessModeItems: RadioFieldItem[] = [
  { value: "", label: "None" },
  { value: "scaled", label: "Scaled" },
  { value: "sharpened", label: "Sharpened" },
];
const SharpeningLaplacianFilter: React.FC<DefaultFieldsProps> = ({
  disabled,
}) => {
  const classes = useStyles();

  return (
    <>
      <Grid item>
        <Field
          allowNull
          name="sharpening-laplacian-filter-mask-mode"
          component={SelectField}
          items={sharpeningLaplacianFilterMaskModeItems}
          textFieldProps={{
            className: classes.textField,
            disabled,
            label: "Type",
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
          component={RadioField}
          items={sharpeningLaplacianFilterProcessModeItems}
          label="Process Mode:"
          name="sharpening-laplacian-filter-process-mode"
          required
        />
      </Grid>
    </>
  );
};

export default React.memo(SharpeningLaplacianFilter);
