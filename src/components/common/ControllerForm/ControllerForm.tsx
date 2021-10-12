import React, { useEffect, useMemo } from "react";

import { Field, useFormState, useForm } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import SelectField from "src/components/common/SelectField";
import BitsCheckboxField from "src/components/common/BitsCheckboxField";

import SpatialResolution from "./SpatialResolution";
import GrayLevelResolution from "./GrayLevelResolution";
import HistogramEqualization from "./HistogramEqualization";
import SpatialFilter from "./SpatialFilter";

import useStyles from "./useStyles";
import { ControllerFormProps, SelectionItem } from "./types";

const resolutionItems: SelectionItem[] = [
  { value: "", text: "None" },
  { value: "spatial-resolution", text: "Spatial Resolution" },
  { value: "gray-level-resolution", text: "Gray Level Resolution" },
  { value: "histogram-equalization", text: "Histogram Equalization" },
  { value: "spatial-filter", text: "Spatial Filter" },
  { value: "bit-planes-removing", text: "Bit Planes Removing" },
];

const ControllerForm: React.FC<ControllerFormProps> = ({ disabled }) => {
  const classes = useStyles();
  const formApi = useForm();
  const values = useFormState().values;

  const fields = useMemo(() => {
    switch (
      values?.type as
        | undefined
        | "spatial-resolution"
        | "gray-level-resolution"
        | "histogram-equalization"
        | "spatial-filter"
        | "bit-planes-removing"
    ) {
      case "spatial-resolution":
        return <SpatialResolution disabled={disabled} />;
      case "gray-level-resolution":
        return <GrayLevelResolution disabled={disabled} />;
      case "histogram-equalization":
        return <HistogramEqualization disabled={disabled} />;
      case "spatial-filter":
        return <SpatialFilter disabled={disabled} />;
      case "bit-planes-removing":
        return (
          <Grid item>
            <Field
              allowNull
              name="bits"
              type="number"
              component={BitsCheckboxField}
              disabled={disabled}
            />
          </Grid>
        );
    }
    return null;
  }, [values?.type, disabled]);

  useEffect(
    () => {
      formApi.reset({
        type: values?.type,
        source: values.source,
      });
    },
    // eslint-disable-next-line
    [values?.type]
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
            className: classes.selectField,
            disabled,
            label: "Resolution",
            variant: "outlined",
            required: true,
            size: "small",
            SelectProps: { autoWidth: true },
          }}
        />
      </Grid>
      {fields}
    </Grid>
  );
};

export default React.memo(ControllerForm);
