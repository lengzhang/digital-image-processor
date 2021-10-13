import React from "react";

import Typography from "@material-ui/core/Typography";

import { SpatialFilteringItem } from "src/hooks/useImageItems/useSpatialFilter";

const Text: React.FC<{ label: string; value: string | number }> = React.memo(
  ({ label, value }) => {
    return (
      <Typography display="block" noWrap>
        {label}: {value}
      </Typography>
    );
  }
);

const SpatialFilterDetails: React.FC<{ item: SpatialFilteringItem }> = ({
  item,
}) => {
  return (
    <>
      <Text label="Filter Mode" value={item.method} />
      {"filterSize" in item && (
        <Text label="Filter Kernel Size" value={item.filterSize} />
      )}
      {"order" in item && <Text label="Q" value={item.order} />}
      {"K" in item && <Text label="K" value={item.K} />}
      {"sigma" in item && <Text label="σ (Sigma)" value={item.sigma} />}
      {"blurredImage" in item && (
        <Text label="Blurred Image" value={item.blurredImage} />
      )}
      {"highBoostingK" in item && <Text label="K" value={item.highBoostingK} />}
      {"maskMode" in item && <Text label="Mask Mode" value={item.maskMode} />}
      {"processMode" in item && (
        <Text label="Process Mode" value={item.processMode} />
      )}
    </>
  );
};

export default React.memo(SpatialFilterDetails);
