import React, { useMemo } from "react";

import { Field, useFormState } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import SelectField from "src/components/common/SelectField";

import GaussianSmoothingFilter from "./GaussianSmoothingFilter";
import MedianFilter from "./MedianFilter";
import SharpeningLaplacianFilter from "./SharpeningLaplacianFilter";
import HighBoostingFilter from "./HighBoostingFilter";

import { DefaultFieldsProps, SelectionItem } from "../types";
import useStyles from "../useStyles";

const spatialFilterMethodItems: SelectionItem[] = [
  { value: "gaussian-smoothing-filter", text: "Gaussian Smoothing Filter" },
  { value: "median-filter", text: "Median Filter" },
  { value: "sharpening-laplacian-filter", text: "Sharpening Laplacian Filter" },
  { value: "high-boosting-filter", text: "High Boosting Filter" },
];

const SpatialFilter: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();
  const values = useFormState().values;

  const fields = useMemo(() => {
    switch (values["spatial-filter-type"]) {
      case "gaussian-smoothing-filter":
        return <GaussianSmoothingFilter disabled={disabled} />;
      case "median-filter":
        return <MedianFilter disabled={disabled} />;
      case "sharpening-laplacian-filter":
        return <SharpeningLaplacianFilter disabled={disabled} />;
      case "high-boosting-filter":
        return <HighBoostingFilter disabled={disabled} />;
    }
    return null;
  }, [values, disabled]);

  return (
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
      {fields}
    </>
  );
};

export default React.memo(SpatialFilter);
