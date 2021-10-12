import { FormApi } from "final-form";
import { BitType } from "src/utils/grayLevelResolution";
import { scrollToBottom } from "src/utils";

import useImageItems from "src/hooks/useImageItems";

import {
  spatialFilteringMethodType,
  sharpeningLaplacianMaskMode,
} from "src/hooks/useImageItems/useSpatialFilter";

const useController = () => {
  const {
    state,
    nearestNeighborInterpolation,
    linearInterpolation,
    bilinearInterpolation,
    grayLevelResolution,
    bitPlanesRemoving,
    histogramEqualization,
    gaussianSmoothingFilter,
    medianFilter,
    sharpeningLaplacianFilter,
    highBoostingFilter,
  } = useImageItems();

  const onSubmit = async (values: Record<string, string>, formApi: FormApi) => {
    const source = parseInt(values.source);

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
        source,
        width: parseInt(values.width),
        height: parseInt(values.height),
      });
    } else if (values.type === "gray-level-resolution") {
      await grayLevelResolution({
        source,
        bit: parseInt(values.bit) as BitType,
      });
    } else if (values.type === "bit-planes-removing") {
      await bitPlanesRemoving({
        source,
        bits: parseInt(values.bits),
      });
    } else if (values.type === "histogram-equalization") {
      await histogramEqualization({
        source,
        size:
          values["histogram-equalization-type"] === "local"
            ? parseInt(values["histogram-equalization-local-size"]) || undefined
            : undefined,
      });
    } else if (values.type === "spatial-filter") {
      const method = spatialFilteringMethodType.find(
        (m) => m === values?.["spatial-filter-type"]
      );

      if (method === undefined) {
        return { "spatial-filter-type": "Spatial filter type is invalid." };
      }

      if (method === "gaussian-smoothing-filter") {
        await gaussianSmoothingFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
          K: parseFloat(values["gaussian-smoothing-filter-K"]) || 1,
          sigma: parseFloat(values["gaussian-smoothing-filter-sigma"]) || 1,
        });
      } else if (method === "median-filter") {
        await medianFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
        });
      } else if (method === "sharpening-laplacian-filter") {
        const maskMode = sharpeningLaplacianMaskMode.find(
          (m) => m === values["sharpening-laplacian-filter-mask-mode"]
        );
        if (maskMode === undefined) {
          return {
            "sharpening-laplacian-filter-mask-mode": "Mask mode is invalid.",
          };
        }
        await sharpeningLaplacianFilter({
          source,
          maskMode,
          processMode:
            values["sharpening-laplacian-filter-process-mode"] || "none",
        });
      } else if (method === "high-boosting-filter") {
        await highBoostingFilter({
          source,
          blurredImage: parseInt(values["high-boosting-filter-blurred-image"]),
          highBoostingK: parseInt(values["high-boosting-filter-k"]) || 1,
        });
      }
    }
    scrollToBottom();
  };

  return { disabled: state.status !== "idle", items: state.items, onSubmit };
};

export default useController;
