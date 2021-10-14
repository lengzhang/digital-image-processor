import { FormApi } from "final-form";
import { BitType } from "src/utils/grayLevelResolution";
import { scrollToBottom } from "src/utils";

import useImageItems from "src/hooks/useImageItems";

import {
  spatialFilteringMethodType,
  sharpeningLaplacianMaskMode,
} from "src/hooks/useImageItems/useSpatialFilter";
import { noiseDistributionMethods } from "src/hooks/useImageItems/useNoiseDistribution";

const useController = () => {
  const { state, ...operations } = useImageItems();

  const onSubmit = async (values: Record<string, string>, formApi: FormApi) => {
    const source = parseInt(values.source);

    if (values.type === "spatial-resolution") {
      const interpolationFn =
        values.method === "nearest-neighbor-interpolation"
          ? operations.nearestNeighborInterpolation
          : values.method === "linear-interpolation-x"
          ? operations.linearInterpolation("x")
          : values.method === "linear-interpolation-y"
          ? operations.linearInterpolation("y")
          : operations.bilinearInterpolation;
      await interpolationFn({
        source,
        width: parseInt(values.width),
        height: parseInt(values.height),
      });
    } else if (values.type === "gray-level-resolution") {
      await operations.grayLevelResolution({
        source,
        bit: parseInt(values.bit) as BitType,
      });
    } else if (values.type === "bit-planes-removing") {
      await operations.bitPlanesRemoving({
        source,
        bits: parseInt(values.bits),
      });
    } else if (values.type === "histogram-equalization") {
      await operations.histogramEqualization({
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

      if (method === "alpha-trimmed-mean-filter") {
        /** Alpha-trimmed Mean Filter */
        await operations.alphaTrimmedMeanFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
          d: parseInt(values["alpha-trimmed-mean-filter-d"]) || 0,
        });
      } else if (method === "arithmetic-mean-filter") {
        /** Arithmetic Mean Filter */
        await operations.arithmeticMeanFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
        });
      } else if (method === "contraharmonic-mean-filter") {
        /** Contraharmonic Mean Filter */
        await operations.contraharmonicMeanFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
          order: parseInt(values["contraharmonic-mean-filter-order"]) || 1,
        });
      } else if (method === "gaussian-smoothing-filter") {
        /** Gaussian Smoothing Filter */
        await operations.gaussianSmoothingFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
          K: parseFloat(values["gaussian-smoothing-filter-K"]) || 1,
          sigma: parseFloat(values["gaussian-smoothing-filter-sigma"]) || 1,
        });
      } else if (method === "geometric-mean-filter") {
        /** Geometric Mean Filter */
        await operations.geometricMeanFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
        });
      } else if (method === "harmonic-mean-filter") {
        /** Harmonic Mean Filter */
        await operations.harmonicMeanFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
        });
      } else if (method === "high-boosting-filter") {
        /** High-boosting Filter */
        await operations.highBoostingFilter({
          source,
          blurredImage: parseInt(values["high-boosting-filter-blurred-image"]),
          highBoostingK: parseInt(values["high-boosting-filter-k"]) || 1,
        });
      } else if (method === "max-filter") {
        /** Max Filter */
        await operations.maxFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
        });
      } else if (method === "median-filter") {
        /** Median Filter */
        await operations.medianFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
        });
      } else if (method === "midpoint-filter") {
        /** Midpoint Filter */
        await operations.midpointFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
        });
      } else if (method === "min-filter") {
        /** Min Filter */
        await operations.minFilter({
          source,
          size: parseInt(values["spatial-filter-size"]) || 3,
        });
      } else if (method === "sharpening-laplacian-filter") {
        /** Sharpening Laplacian Filter */
        const maskMode = sharpeningLaplacianMaskMode.find(
          (m) => m === values["sharpening-laplacian-filter-mask-mode"]
        );
        if (maskMode === undefined) {
          return {
            "sharpening-laplacian-filter-mask-mode": "Mask mode is invalid.",
          };
        }
        await operations.sharpeningLaplacianFilter({
          source,
          maskMode,
          processMode:
            values["sharpening-laplacian-filter-process-mode"] || "none",
        });
      }
    } else if (values.type === "noise-distribution") {
      const method = noiseDistributionMethods.find(
        (m) => m === values?.["noise-distribution-type"]
      );

      if (method === "noise-distribution-gaussian") {
        const mean = parseInt(values["noise-distribution-gaussian-mean"]);
        const sigma = parseFloat(values["noise-distribution-gaussian-sigma"]);
        const k = parseFloat(values["noise-distribution-gaussian-k"]);
        await operations.gaussianNoiseDistribution({ source, mean, sigma, k });
      }
    } else if (values.type === "operation") {
      const method = values?.["operations-method"];

      if (method === "addition") {
        const addend = parseInt(values["operations-addend"]);

        console.log(values, addend, state.items);
        if (
          Number.isNaN(addend) ||
          addend < 0 ||
          addend >= state.items.length
        ) {
          return { "operations-addend": "Addend is invalid." };
        }
        await operations.addition({ source, addend });
      } else if (method === "subtraction") {
        const minuend = parseInt(values["operations-minuend"]);
        if (
          Number.isNaN(minuend) ||
          minuend < 0 ||
          minuend >= state.items.length
        ) {
          return { "operations-minuend": "Minuend is invalid." };
        }
        await operations.subtraction({ source, minuend });
      } else if (method === "scaling") {
        await operations.scaling({ source });
      }
    }
    scrollToBottom();
  };

  return { disabled: state.status !== "idle", items: state.items, onSubmit };
};

export default useController;
