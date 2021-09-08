import { combineReducers } from "@reduxjs/toolkit";

import imageItemsSlice from "./imageItems";

const rootReducer = combineReducers({
  imageItems: imageItemsSlice.reducer,
});

export default rootReducer;
