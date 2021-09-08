import React from "react";

import MenuItem from "@material-ui/core/MenuItem";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { FieldRenderProps } from "react-final-form";

interface SelectFieldProps extends FieldRenderProps<string> {
  items: { value: string; text: string }[];
  textFieldProps?: TextFieldProps;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  input,
  meta,
  items,
  textFieldProps,
  placeholder,
}) => {
  const errorMessage = meta.error ?? meta.submitError ?? null;

  const placeholderProps = placeholder
    ? {
        displayEmpty: true,
        renderValue: (value: any) => {
          if (value) return value;
          return (
            <Typography color="textSecondary">
              <em>{placeholder}</em>
            </Typography>
          );
        },
      }
    : {};

  return (
    <TextField
      {...input}
      InputLabelProps={{ shrink: true }}
      error={!!errorMessage}
      helperText={errorMessage || ""}
      {...textFieldProps}
      SelectProps={{ ...textFieldProps?.SelectProps, ...placeholderProps }}
      select
    >
      {items.map(({ text, value }) => (
        <MenuItem key={value} value={value}>
          {text}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectField;
