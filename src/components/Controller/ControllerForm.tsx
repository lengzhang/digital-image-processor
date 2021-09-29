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

interface SelectionItem {
  value: string | number;
  text: string;
}

const resolutionItems: SelectionItem[] = [
  { value: "", text: "None" },
  { value: "spatial-resolution", text: "Spatial Resolution" },
  { value: "gray-level-resolution", text: "Gray Level Resolution" },
  { value: "histogram-equalization", text: "Histogram Equalization" },
  { value: "spatial-filter", text: "Spatial Filter" },
  { value: "bit-planes-removing", text: "Bit Planes Removing" },
];

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

const histogramEqualizationItems: SelectionItem[] = [
  { value: "global", text: "Global" },
  { value: "local", text: "Local" },
];

const histogramEqualizationLocalItems: SelectionItem[] = [
  { value: 3, text: "3x3" },
  { value: 5, text: "5x5" },
  { value: 7, text: "7x7" },
  { value: 9, text: "9x9" },
];

const spatialFilterMethodItems: SelectionItem[] = [
  { value: "smoothing-filter", text: "Smoothing Filter" },
  { value: "median-filter", text: "Median Filter" },
  { value: "sharpening-laplacian-filter", text: "Sharpening Laplacian Filter" },
  { value: "high-boosting-filter", text: "High Boosting Filter" },
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
  const values = useFormState().values;

  const sourceItem = React.useMemo(
    () => items?.[parseInt(values.source)] ?? null,
    [items, values.source]
  );

  React.useEffect(
    () => {
      formApi.reset({
        type: values.type,
        source: values.source,
        method: "nearest-neighbor-interpolation",
        bit: "8",
      });
    },
    // eslint-disable-next-line
    [values.type]
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
      {values.type === "spatial-resolution" && (
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
      {values.type === "gray-level-resolution" && (
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
      {values.type === "histogram-equalization" && (
        <>
          <Grid item>
            <Field
              allowNull
              name="histogram-equalization-type"
              component={SelectField}
              items={histogramEqualizationItems}
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
          {values?.["histogram-equalization-type"] === "local" && (
            <Grid item>
              <Field
                allowNull
                name="histogram-equalization-local-size"
                component={SelectField}
                items={histogramEqualizationLocalItems}
                textFieldProps={{
                  className: classes.textField,
                  disabled,
                  label: "Size",
                  variant: "outlined",
                  required: true,
                  size: "small",
                  SelectProps: { autoWidth: true },
                }}
              />
            </Grid>
          )}
        </>
      )}
      {values.type === "spatial-filter" && (
        <>
          <Grid item>
            <Field
              allowNull
              name="spatial-filter-type"
              component={SelectField}
              items={spatialFilterMethodItems}
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
              name="spatial-filter-size"
              component={InputField}
              textFieldProps={{
                className: classes.textField,
                label: "Kernel Size",
                required: true,
                size: "small",
                type: "number",
              }}
            />
          </Grid>
          {values["spatial-filter-type"] === "smoothing-filter" && (
            <Grid item>
              <Field
                allowNull
                name="smoothing-filter-sigma"
                component={InputField}
                textFieldProps={{
                  className: classes.textField,
                  label: "σ (sigma)",
                  required: true,
                  size: "small",
                  type: "number",
                }}
              />
            </Grid>
          )}
        </>
      )}
      {values.type === "bit-planes-removing" &&
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
