import React, { useMemo } from "react";

import { Field, useFormState } from "react-final-form";

import Grid from "@material-ui/core/Grid";

import SelectField from "src/components/common/SelectField";

import {
  NoiseDistributionItem,
  noiseDistributionMethods,
} from "src/hooks/useImageItems/useNoiseDistribution";

import Gaussian from "./Gaussian";

import { DefaultFieldsProps } from "../types";
import useStyles from "../useStyles";

const noiseDistributionMethodItems: {
  value: NoiseDistributionItem["method"];
  text: string;
}[] = [
  {
    value: "noise-distribution-gaussian",
    text: "Gaussian",
  },
];

const NoiseDistribution: React.FC<DefaultFieldsProps> = ({ disabled }) => {
  const classes = useStyles();
  const values = useFormState().values;

  const fields = useMemo(() => {
    const type = noiseDistributionMethods.find(
      (m) => m === values["noise-distribution-type"]
    );
    switch (type) {
      case "noise-distribution-gaussian":
        return <Gaussian disabled={disabled} />;
    }
    return null;
  }, [values, disabled]);

  return (
    <>
      <Grid item>
        <Field
          allowNull
          name="noise-distribution-type"
          component={SelectField}
          items={noiseDistributionMethodItems}
          textFieldProps={{
            className: classes.selectField,
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

export default NoiseDistribution;
