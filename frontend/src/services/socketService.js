import { io } from "socket.io-client";

import { changeUserOnlineStatus } from "../store/messageSlice";

let socket = null;

export const getSocket = () => socket;

export const connectSocket = (email) => {
  if (socket && socket.connected) return socket;
  socket = io(import.meta.env.VITE_API_URL, {
    query: { email },
    autoConnect: true,
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
  }
};

export const subsToFriendStatus = (dispatch) => {
  if (!socket || !socket?.connected) return;
  socket.on("friend-status-changed", (result) => {
    dispatch(changeUserOnlineStatus(result));
  });
};

export const unSubsToFriendStatus = () => {
  if (!socket || !socket?.connected) return;
  socket.off("friend-status-changed");
};

export const subsToNewMessage = () => {};

export const unSubsToNewMessage = () => {};
