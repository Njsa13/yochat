import { createSlice } from "@reduxjs/toolkit";

import { io } from "socket.io-client";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, socket: null },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    connectSocket: (state) => {
      if (!state.user || state.socket?.connected) return;
      const socket = io(import.meta.env.VITE_API_URL, {
        query: {
          email: state.user?.email,
        },
      });
      socket.connect();
      state.socket = socket;
    },
    disconnectSocket: (state) => {
      if (state.socket?.connected) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
});

export const { setCredentials, logout, connectSocket, disconnectSocket } =
  authSlice.actions;
export default authSlice.reducer;
