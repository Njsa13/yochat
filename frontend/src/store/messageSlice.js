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
    changeUserOnlineStatus: (state, action) => {
      const result = action.payload;
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
  changeUserOnlineStatus,
} = messageSlice.actions;
export default messageSlice.reducer;
