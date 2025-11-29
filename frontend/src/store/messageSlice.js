import { createSlice } from "@reduxjs/toolkit";

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
      const { email, status } = action.payload;
      state.contacts = state.contacts.map((c) => {
        if (c.partnerChat.email !== email) return c;
        return { ...c, isOnline: status === "online" };
      });
      if (state.selectedContact?.partnerChat.email === email) {
        state.selectedContact.isOnline = status === "online";
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
