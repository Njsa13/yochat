import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./themeSlice.js";
import authReducer from "./authSlice.js";
import messageReducer from "./messageSlice.js";
import { authApi } from "../services/authApi.js";
import { messageApi } from "../services/messageApi.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    message: messageReducer,
    [authApi.reducerPath]: authApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(messageApi.middleware),
});

export default store;
