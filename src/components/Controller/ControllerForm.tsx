import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { Field, useFormState, useForm } from "react-final-form";

import SelectField from "src/components/common/SelectField";
import InputField from "src/components/common/InputField";
import BitsCheckboxField from "src/components/common/BitsCheckboxField";
import { ImageItem } from "src/hooks/useImageItems";

interface ControllerFormProps {
  disabled?: boolean;
  items: ImageItem[];
}

const resolutionItems: { value: string; text: string }[] = [
  { value: "", text: "None" },
  { value: "spatial-resolution", text: "Spatial Resolution" },
  {
    value: "gray-level-resolution",
    text: "Gray Level Resolution",
  },
  {
    value: "bit-planes-removing",
    text: "Bit Planes Removing",
  },
];

const methodItems = [
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

const bitItems = [1, 2, 3, 4, 5, 6, 7, 8].map((v) => ({
  value: `${v}`,
  text: `${v}`,
}));

const useStyles = makeStyles((theme) => ({
  textField: {
    minWidth: 120,
  },
}));

const ControllerForm: React.FC<ControllerFormProps> = ({ disabled, items }) => {
  const classes = useStyles();
  const formApi = useForm();
  const { type, source } = useFormState().values;

  const sourceItem = React.useMemo(
    () => items?.[parseInt(source)] ?? null,
    [items, source]
  );

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
            className: classes.textField,
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
                className: classes.textField,
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
                className: classes.textField,
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
                className: classes.textField,
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
      )}
      {type === "bit-planes-removing" &&
        (sourceItem !== null ? (
          <Grid item>
            <Field
              allowNull
              name="bits"
              type="number"
              component={BitsCheckboxField}
            />
          </Grid>
        ) : (
          <Grid item component={Box} alignSelf="center" flexGrow={1}>
            <Typography>Source Item Not Found!!</Typography>
          </Grid>
        ))}
    </Grid>
  );
};

export default ControllerForm;
