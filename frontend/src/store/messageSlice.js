import { createSlice } from "@reduxjs/toolkit";
import { getSocket } from "../services/socketService";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    contacts: [],
    contactsHasNextPage: false,
    selectedContact: null,
    messages: [],
    messagesHasNextPage: false,
    isModalOpen: false,
  },
  reducers: {
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    setContactsHasNextPage: (state, action) => {
      state.contactsHasNextPage = action.payload;
    },
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    deleteSelectedContacts: (state) => {
      state.selectedContact = null;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMessagesHasNextPage: (state, action) => {
      state.messagesHasNextPage = action.payload;
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    subsToFriendStatus: (state) => {
      const socket = getSocket(); //Todo: Selanjutnya pindahkan listener ke socket.js

      socket.on("friend-status-changed", (result) => {
        console.log("Berhasil");
        if (result?.status === "online") {
          state.contacts = state.contacts.map((contact) => {
            if (contact.email !== result?.email) return;
            contact.isOnline = true;
          });
        } else if (result?.status === "offline") {
          state.contacts = state.contacts.map((contact) => {
            if (contact.email !== result?.email) return;
            contact.isOnline = false;
          });
        }
      });
    },
    unSubsToFriendStatus: () => {
      const socket = getSocket();
      socket.off("friend-status-changed");
    },
    subsToNewMessage: (state) => {
      const socket = getSocket();
      // Todo: Lanjut
    },
  },
});

export const {
  setContacts,
  setContactsHasNextPage,
  setSelectedContact,
  deleteSelectedContacts,
  setMessages,
  setMessagesHasNextPage,
  setIsModalOpen,
  subsToFriendStatus,
  unSubsToFriendStatus,
} = messageSlice.actions;
export default messageSlice.reducer;
