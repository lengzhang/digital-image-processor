import React from "react";

import Typography from "@material-ui/core/Typography";

import { ImageItem } from "src/hooks/useImageItems";

const Text: React.FC<{ label: string; value: string | number }> = React.memo(
  ({ label, value }) => {
    return (
      <Typography display="block" noWrap>
        {label}: {value}
      </Typography>
    );
  }
);

const GeneralDetails: React.FC<
  Pick<ImageItem, "bit" | "isGrayScaled"> & { text: string }
> = ({ text, bit, isGrayScaled }) => {
  return (
    <>
      <Typography display="block" noWrap>
        {text}
      </Typography>
      <Text label="Bit" value={`${bit}-bit`} />
      <Text label="Gray Scaled" value={isGrayScaled.toString()} />
    </>
  );
};

export default React.memo(GeneralDetails);
