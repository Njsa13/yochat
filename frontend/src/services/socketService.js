import { io } from "socket.io-client";

import {
  changeUserOnlineStatus,
  setContacts,
  setMessages,
  setSelectedContact,
} from "../store/messageSlice";
import { setSocketConnected } from "../store/authSlice";

let socket = null;

export const getSocket = () => socket;

export const connectSocket = (email) => {
  if (socket && socket.connected) return;
  socket = io(import.meta.env.VITE_API_URL, {
    query: { email },
    autoConnect: true,
  });
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
  }
};

export const initSocketSubs = (dispatch) => {
  if (!socket) return;

  socket.on("connect", () => {
    dispatch(setSocketConnected(true));
  });

  socket.on("friend-status-changed", (result) => {
    dispatch(changeUserOnlineStatus(result));
  });

  socket.on("new-message-sidebar", (result) => {
    dispatch((dispatch, getState) => {
      dispatch(
        setContacts([
          result,
          ...getState().message.contacts.filter(
            (val) => val.partnerChat?.email !== result.partnerChat.email
          ),
        ])
      );

      if (
        getState().message.selectedContact?.chatRoomId === result.chatRoomId
      ) {
        dispatch(
          setSelectedContact({
            ...getState().message.selectedContact,
            unread: result.unread,
          })
        );
      }
    });
  });

  socket.on("disconnect", () => {
    dispatch(setSocketConnected(false));
  });
};

export const subsToNewMessage = (dispatch) => {
  if (!socket) return;
  socket.on("new-message", (result) => {
    dispatch((dispatch, getState) => {
      if (
        getState().message.selectedContact?.partnerChat.email ===
        result.senderEmail
      ) {
        dispatch(setMessages([result, ...getState().message.messages]));
      }
    });
  });
};

export const unSubsToNewMessage = () => {
  if (!socket) return;
  socket.off("new-message");
};
