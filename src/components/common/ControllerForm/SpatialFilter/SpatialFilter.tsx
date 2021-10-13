import React, { useMemo } from "react";

import { Field, useFormState } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import SelectField from "src/components/common/SelectField";

import {
  spatialFilteringMethodType,
  SpatialFilteringMethodType,
} from "src/hooks/useImageItems/useSpatialFilter";

import GaussianSmoothingFilter from "./GaussianSmoothingFilter";
import SizeOnlyFilter from "./SizeOnlyFilter";
import SharpeningLaplacianFilter from "./SharpeningLaplacianFilter";
import HighBoostingFilter from "./HighBoostingFilter";

import { DefaultFieldsProps } from "../types";
import useStyles from "../useStyles";
import ContraharmonicMeanFilter from "./ContraharmonicMeanFilter";

const spatialFilterMethodItems: {
  value: SpatialFilteringMethodType;
  text: string;
}[] = [
  { value: "alpha-trimmed-mean-filter", text: "Alpha-trimmed Mean Filter" },
  { value: "arithmetic-mean-filter", text: "Arithmetic Mean Filter" },
  { value: "contraharmonic-mean-filter", text: "Contraharmonic Mean Filter" },
  { value: "gaussian-smoothing-filter", text: "Gaussian Smoothing Filter" },
  { value: "geometric-mean-filter", text: "Geometric Mean Filter" },
  { value: "harmonic-mean-filter", text: "Harmonic Mean Filter" },
  { value: "high-boosting-filter", text: "High Boosting Filter" },
  { value: "max-filter", text: "Max Filter" },
  { value: "median-filter", text: "Median Filter" },
  { value: "midpoint-filter", text: "Midpoint Filter" },
  { value: "min-filter", text: "Min Filter" },
  { value: "sharpening-laplacian-filter", text: "Sharpening Laplacian Filter" },
];

const SpatialFilter: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();
  const values = useFormState().values;

  const fields = useMemo(() => {
    const type = spatialFilteringMethodType.find(
      (m) => m === values["spatial-filter-type"]
    );

    switch (type) {
      case "arithmetic-mean-filter":
      case "geometric-mean-filter":
      case "harmonic-mean-filter":
      case "min-filter":
      case "median-filter":
      case "max-filter":
      case "midpoint-filter":
        return <SizeOnlyFilter disabled={disabled} />;
      case "contraharmonic-mean-filter":
        return <ContraharmonicMeanFilter disabled={disabled} />;
      case "gaussian-smoothing-filter":
        return <GaussianSmoothingFilter disabled={disabled} />;
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
