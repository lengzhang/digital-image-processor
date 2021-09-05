import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import TextField, { TextFieldProps } from "@material-ui/core/TextField";

interface ControllerSelectionProps
  extends Pick<
    TextFieldProps,
    "label" | "onChange" | "value" | "defaultValue"
  > {}

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: 120,
  },
}));

const ControllerSelection: React.FC<ControllerSelectionProps> = ({
  defaultValue,
  children,
  label,
  onChange,
  value,
}) => {
  const classes = useStyles();
  return (
    <TextField
      className={classes.select}
      defaultValue={defaultValue}
      label={label}
      onChange={onChange}
      required
      select
      size="small"
      value={value}
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      SelectProps={{ autoWidth: true }}
    >
      {children}
    </TextField>
  );
};

export default ControllerSelection;
