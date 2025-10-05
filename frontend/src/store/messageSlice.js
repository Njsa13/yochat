import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    contacts: [],
    contactsHasNextPage: false,
    selectedContact: null,
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
    deleteContacts: (state) => {
      state.contacts = [];
    },
  },
});

export const {
  setContacts,
  setContactsHasNextPage,
  setSelectedContact,
  deleteContacts,
} = messageSlice.actions;
export default messageSlice.reducer;
