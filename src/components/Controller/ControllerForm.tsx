import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import { Field, useFormState, useForm } from "react-final-form";

import SelectField from "src/components/common/SelectField";
import InputField from "src/components/common/InputField";

interface ControllerFormProps {
  disabled?: boolean;
}

const resolutionItems = [
  { value: "", text: "None" },
  { value: "spatial-resolution", text: "Spatial Resolution" },
  {
    value: "gray-level-resolution",
    text: "Gray Level Resolution",
  },
];

const methodItems = [
  {
    value: "nearest-neighbor-interpolation",
    text: "Nearest Neighbor Interpolation",
  },
  { value: "linear-interpolation", text: "Linear Interpolation" },
  { value: "bilinear-interpolation", text: "Bilinear Interpolation" },
];

const bitItems = [1, 2, 3, 4, 5, 6, 7, 8].map((v) => ({
  value: `${v}`,
  text: `${v}`,
}));

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: 120,
  },
}));

const ControllerForm: React.FC<ControllerFormProps> = ({ disabled }) => {
  const classes = useStyles();
  const formApi = useForm();
  const { type, source } = useFormState().values;

  React.useEffect(
    () => {
      formApi.reset({
        type,
        source,
        method: "nearest-neighbor-interpolation",
        bit: "8",
      });
    },
    // eslint-disable-next-line
    [type]
  );

  return (
    <Grid container spacing={1} wrap="nowrap">
      <Grid item>
        <Field
          allowNull
          name="type"
          component={SelectField}
          items={resolutionItems}
          textFieldProps={{
            className: classes.select,
            disabled,
            label: "Resolution",
            variant: "outlined",
            required: true,
            size: "small",
            SelectProps: { autoWidth: true },
          }}
        />
      </Grid>
      {type === "spatial-resolution" && (
        <>
          <Grid item>
            <Field
              allowNull
              name="method"
              component={SelectField}
              items={methodItems}
              textFieldProps={{
                className: classes.select,
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
                label: "Width",
                required: true,
                size: "small",
                type: "number",
              }}
            />
          </Grid>
          <Grid item>
            <Field
              allowNull
              name="height"
              component={InputField}
              textFieldProps={{
                label: "Height",
                required: true,
                size: "small",
                type: "number",
              }}
            />
          </Grid>
        </>
      )}
      {type === "gray-level-resolution" && (
        <Grid item>
          <Field
            allowNull
            name="bit"
            component={SelectField}
            items={bitItems}
            textFieldProps={{
              className: classes.select,
              disabled,
              label: "Bit",
              variant: "outlined",
              required: true,
              size: "small",
              SelectProps: { autoWidth: true },
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ControllerForm;
