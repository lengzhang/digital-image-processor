import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Field, useFormState, useForm } from "react-final-form";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import BitsCheckboxField from "src/components/common/BitsCheckboxField";
import InputField from "src/components/common/InputField";
import RadioField, { RadioFieldItem } from "src/components/common/RadioField";
import SelectField from "src/components/common/SelectField";

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

const spatialFilterMethodItems: SelectionItem[] = [
  { value: "gaussian-smoothing-filter", text: "Gaussian Smoothing Filter" },
  { value: "median-filter", text: "Median Filter" },
  { value: "sharpening-laplacian-filter", text: "Sharpening Laplacian Filter" },
  { value: "high-boosting-filter", text: "High Boosting Filter" },
];

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

  const sourceItems = React.useMemo(
    () =>
      items.map<SelectionItem>((_, i) => ({
        value: `${i}`,
        text: `${i === 0 ? "Original" : i}`,
      })),
    [items]
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
                disabled,
                label: "Width",
                required: true,
                size: "small",
                type: "number",
              }}
              validate={(value, _, meta) => {
                if (meta?.dirty) {
                  const num = parseFloat(value);
                  if (num < 0 || !Number.isInteger(num))
                    return "Width must be positive integer.";
                }
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
                disabled,
                label: "Height",
                required: true,
                size: "small",
                type: "number",
              }}
              validate={(value, _, meta) => {
                if (meta?.dirty) {
                  const num = parseFloat(value);
                  if (num < 0 || !Number.isInteger(num))
                    return "Height must be positive integer.";
                }
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
                component={InputField}
                textFieldProps={{
                  className: classes.textField,
                  disabled,
                  label: "Size",
                  required: true,
                  size: "small",
                  type: "number",
                }}
                validate={(value, _, meta) => {
                  if (meta?.dirty) {
                    const num = parseFloat(value);
                    if (num < 0 || !Number.isInteger(num))
                      return "Filter size must be positive integer.";
                  }
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
          {(values["spatial-filter-type"] === "gaussian-smoothing-filter" ||
            values["spatial-filter-type"] === "median-filter") && (
            <Grid item>
              <Field
                allowNull
                name="spatial-filter-size"
                component={InputField}
                textFieldProps={{
                  className: classes.textField,
                  disabled,
                  label: "Kernel Size",
                  required: true,
                  size: "small",
                  type: "number",
                }}
                validate={(value, _, meta) => {
                  if (meta?.dirty) {
                    const num = parseFloat(value);
                    if (num < 0 || !Number.isInteger(num) || num % 2 !== 1)
                      return "Kernel size must be positive odd integer.";
                  }
                }}
              />
            </Grid>
          )}
          {values["spatial-filter-type"] === "gaussian-smoothing-filter" && (
            <>
              <Grid item>
                <Field
                  allowNull
                  name="gaussian-smoothing-filter-K"
                  component={InputField}
                  textFieldProps={{
                    className: classes.textField,
                    disabled,
                    label: "K",
                    required: true,
                    size: "small",
                    type: "number",
                  }}
                />
              </Grid>
              <Grid item>
                <Field
                  allowNull
                  name="gaussian-smoothing-filter-sigma"
                  component={InputField}
                  textFieldProps={{
                    className: classes.textField,
                    disabled,
                    label: "σ (sigma)",
                    required: true,
                    size: "small",
                    type: "number",
                  }}
                />
              </Grid>
            </>
          )}
          {values["spatial-filter-type"] === "sharpening-laplacian-filter" && (
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
          )}
          {values["spatial-filter-type"] === "high-boosting-filter" && (
            <>
              <Grid item>
                <Field
                  allowNull
                  name="high-boosting-filter-blurred-image"
                  component={SelectField}
                  items={sourceItems}
                  textFieldProps={{
                    className: classes.textField,
                    disabled,
                    label: "Blurred Image",
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
                  name="high-boosting-filter-k"
                  component={InputField}
                  textFieldProps={{
                    className: classes.textField,
                    label: "k (k >= 1)",
                    required: true,
                    size: "small",
                    type: "number",
                  }}
                  validate={(value, _, meta) => {
                    if (meta?.dirty) {
                      const num = parseFloat(value);
                      if (num < 1) return "k must be greater than or equal 1.";
                    }
                  }}
                />
              </Grid>
            </>
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
