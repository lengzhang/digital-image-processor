import React from "react";

import { FieldRenderProps, useForm } from "react-final-form";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel, {
  FormControlLabelProps,
} from "@material-ui/core/FormControlLabel";

export interface RadioFieldItem {
  value: string;
  label: string;
  formControlLabelProps?: Partial<
    Omit<FormControlLabelProps, "value" | "label">
  >;
}

interface RadioFieldProps extends FieldRenderProps<any, HTMLElement> {
  label: string;
  items: RadioFieldItem[];
  required?: boolean;
}

const RadioField: React.FC<RadioFieldProps> = ({
  input,
  label,
  items,
  required = false,
}) => {
  const form = useForm();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    form.change(input.name, event.target.value);
  };

  return (
    <FormControl component="fieldset" size="small" required={required}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label={label}
        name={label}
        value={input.value || ""}
        onChange={onChange}
        row
      >
        {items.map((item, i) => (
          <FormControlLabel
            key={`${item.value}-${i}`}
            control={<Radio color="default" />}
            label={item.label}
            value={item.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
export default RadioField;
