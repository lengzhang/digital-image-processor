import React from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import ControllerSelection from "./ControllerSelection";

import { MainControllerProps } from "./types";

const MainController: React.FC<MainControllerProps> = ({
  numOfItems,
  disabledAdd,
  showRemove,
  source,
  onChangeSource,
  onClickAdd,
  onClickClear,
  onClickRemove,
}) => {
  return (
    <Box display="flex" margin={1} marginTop={0}>
      <Box>
        <ControllerSelection
          label="Source"
          onChange={onChangeSource}
          value={source}
          defaultValue={0}
        >
          {Array.from({ length: numOfItems }).map((_, i) => (
            <MenuItem key={i} value={i} dense>
              {i === 0 ? "Origin" : i}
            </MenuItem>
          ))}
        </ControllerSelection>
      </Box>
      <Box marginLeft="auto">
        <Button
          color="primary"
          disabled={disabledAdd}
          onClick={onClickAdd}
          variant="outlined"
        >
          ADD
        </Button>
      </Box>
      <Box marginLeft={1}>
        <Button variant="outlined" color="secondary" onClick={onClickClear}>
          Clear
        </Button>
      </Box>
      {showRemove && (
        <Box marginLeft={1}>
          <Button variant="outlined" color="secondary" onClick={onClickRemove}>
            Remove Last
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MainController;
