import { useAppDispatch, useAppSelector } from "src/redux/store";

import {
  nearestNeighborInterpolation,
  linearInterpolation,
  bilinearInterpolation,
  grayLevelResolution,
} from "src/redux/reducer/imageItems";
import { FormApi } from "final-form";
import { BitType } from "src/utils/grayLevelResolution";

const useController = () => {
  const { status, items } = useAppSelector(({ imageItems }) => ({
    status: imageItems.status,
    items: imageItems.items,
  }));
  const dispatch = useAppDispatch();

  const onSubmit = (values: Record<string, string>, formApi: FormApi) => {
    if (values.type === "spatial-resolution") {
      const interpolationFn =
        values.method === "nearest-neighbor-interpolation"
          ? nearestNeighborInterpolation
          : values.method === "linear-interpolation-x"
          ? linearInterpolation("x")
          : values.method === "linear-interpolation-y"
          ? linearInterpolation("y")
          : bilinearInterpolation;
      dispatch(
        interpolationFn({
          source: parseInt(values.source),
          width: parseInt(values.width),
          height: parseInt(values.height),
        })
      );
    } else if (values.type === "gray-level-resolution") {
      dispatch(
        grayLevelResolution({
          source: parseInt(values.source),
          bit: parseInt(values.bit) as BitType,
        })
      );
    }
  };

  return { disabled: status !== "idle", items, onSubmit };
};

export default useController;
