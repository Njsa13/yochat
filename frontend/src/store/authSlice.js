import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isSocketConnected: false },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
    },
    setSocketConnected: (state, action) => {
      state.isSocketConnected = action.payload;
    },
  },
});

export const { setCredentials, setSocketConnected } = authSlice.actions;
export default authSlice.reducer;
