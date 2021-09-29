import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { FieldRenderProps, useForm } from "react-final-form";

import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

interface BitsCheckboxProps extends FieldRenderProps<any, HTMLElement> {}

const MAX_BIT_VALUE = 255;

const useStyles = makeStyles((theme) => ({
  group: {
    flexWrap: "nowrap",
  },
}));

const bitValueToBooleanArray = (value: number) => {
  return value
    .toString(2)
    .padStart(8, "0")
    .split("")
    .map((v) => v === "1")
    .reverse();
};

const booleanArrayToBitValue = (list: boolean[]) => {
  return parseInt(
    list
      .map((v) => (v ? "1" : "0"))
      .reverse()
      .join(""),
    2
  );
};

const BitsCheckboxField: React.FC<BitsCheckboxProps> = ({ input }) => {
  const classes = useStyles();
  const form = useForm();
  const [checkboxes, setCheckboxes] = React.useState(
    bitValueToBooleanArray(parseInt(input.value) || MAX_BIT_VALUE)
  );
  React.useEffect(() => {
    const value = booleanArrayToBitValue(checkboxes);
    if (value !== input.value) form.change(input.name, value);
  }, [checkboxes, input.value, input.name, form]);

  const onChecked =
    (index: number) =>
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      event.preventDefault();
      setCheckboxes((prevState) =>
        prevState.map((v, i) => (i === index ? checked : v))
      );
    };

  return (
    <FormControl component="fieldset" size="small" required>
      <FormLabel component="legend">Bit Planes:</FormLabel>
      <FormGroup className={classes.group} row>
        {checkboxes.map((checked, i) => {
          const name = `bit-${i + 1}`;
          return (
            <FormControlLabel
              key={name}
              labelPlacement="start"
              control={
                <Checkbox
                  checked={checked}
                  name={name}
                  disableRipple
                  color="primary"
                  size="small"
                  onChange={onChecked(i)}
                />
              }
              label={`${i + 1}`}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

export default BitsCheckboxField;
