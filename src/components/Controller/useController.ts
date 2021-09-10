import { FormApi } from "final-form";
import { BitType } from "src/utils/grayLevelResolution";

import useImageItems from "src/hooks/useImageItems";

const useController = () => {
  const {
    state,
    nearestNeighborInterpolation,
    linearInterpolation,
    bilinearInterpolation,
    grayLevelResolution,
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
    }
  };

  return { disabled: state.status !== "idle", items: state.items, onSubmit };
};

export default useController;
