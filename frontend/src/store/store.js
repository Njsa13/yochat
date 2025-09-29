import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./themeSlice.js";
import authReducer from "./authSlice.js";
import { authApi } from "../services/authApi.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
