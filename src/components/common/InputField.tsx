import React from "react";

import { FieldRenderProps } from "react-final-form";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

interface InputProps extends FieldRenderProps<any, HTMLElement> {
  textFieldProps?: TextFieldProps;
}

const InputField: React.FC<InputProps> = ({ input, meta, textFieldProps }) => {
  const errorMessage = meta.error || meta.submitError || null;
  return (
    <TextField
      style={{ minWidth: "max-content" }}
      {...input}
      InputLabelProps={{ shrink: true }}
      error={!!errorMessage}
      helperText={errorMessage || ""}
      fullWidth
      {...textFieldProps}
      variant="outlined"
    />
  );
};
export default InputField;
