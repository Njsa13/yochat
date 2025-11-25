import { io } from "socket.io-client";

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
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

