import { FormApi } from "final-form";
import { BitType } from "src/utils/grayLevelResolution";
import { scrollToBottom } from "src/utils";

import useImageItems, {
  SharpeningLaplacianMaskMode,
  SpatialFilteringMethodType,
} from "src/hooks/useImageItems";

const useController = () => {
  const {
    state,
    nearestNeighborInterpolation,
    linearInterpolation,
    bilinearInterpolation,
    grayLevelResolution,
    bitPlanesRemoving,
    histogramEqualization,
    spatialFiltering,
  } = useImageItems();

  const onSubmit = async (values: Record<string, string>, formApi: FormApi) => {
    if (values.type === "spatial-resolution") {
      const interpolationFn =
        values.method === "nearest-neighbor-interpolation"
          ? nearestNeighborInterpolation
          : values.method === "linear-interpolation-x"
          ? linearInterpolation("x")
          : values.method === "linear-interpolation-y"
          ? linearInterpolation("y")
          : bilinearInterpolation;
      await interpolationFn({
        source: parseInt(values.source),
        width: parseInt(values.width),
        height: parseInt(values.height),
      });
    } else if (values.type === "gray-level-resolution") {
      await grayLevelResolution({
        source: parseInt(values.source),
        bit: parseInt(values.bit) as BitType,
      });
    } else if (values.type === "bit-planes-removing") {
      await bitPlanesRemoving({
        source: parseInt(values.source),
        bits: parseInt(values.bits),
      });
    } else if (values.type === "histogram-equalization") {
      await histogramEqualization({
        source: parseInt(values.source),
        size:
          values["histogram-equalization-type"] === "local"
            ? parseInt(values["histogram-equalization-local-size"]) || undefined
            : undefined,
      });
    } else if (values.type === "spatial-filter") {
      await spatialFiltering({
        source: parseInt(values.source),
        method: values["spatial-filter-type"] as SpatialFilteringMethodType,
        size: parseInt(values["spatial-filter-size"]) || 3,
        /** Smoothing Filter */
        K: parseFloat(values["gaussian-smoothing-filter-K"]) || 1,
        sigma: parseFloat(values["gaussian-smoothing-filter-sigma"]) || 1,
        /** Sharpening Laplacian Filter */
        maskMode: values[
          "sharpening-laplacian-filter-mask-mode"
        ] as SharpeningLaplacianMaskMode,
        processMode:
          values["sharpening-laplacian-filter-process-mode"] || "none",
        /** High-boosting Filter */
        blurredImage: parseInt(values["high-boosting-filter-blurred-image"]),
        highBoostingK: parseInt(values["high-boosting-filter-k"]) || 1,
      });
    }
    scrollToBottom();
  };

  return { disabled: state.status !== "idle", items: state.items, onSubmit };
};

export default useController;
