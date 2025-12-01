import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setContacts,
  setContactsHasNextPage,
  setIsModalOpen,
  setMessages,
  setMessagesHasNextPage,
  setSelectedContact,
} from "../store/messageSlice.js";
import { toastErrorHandler } from "./handler.js";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: ({ params, reset }) =>
        `/api/message/contacts${
          params ? "?" + new URLSearchParams(params).toString() : ""
        }`,
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (arg.reset) {
            dispatch(setContacts(data?.data));
          } else {
            dispatch(
              setContacts([...getState().message.contacts, ...data.data])
            );
          }
          dispatch(setContactsHasNextPage(data?.hasNextPage));
        } catch (error) {
          console.error(error);
          const status = error.error?.status || 500;
          const msg =
            error.error?.data?.error || "Failed to retrieve contacts data";
          console.error(`Error ${status}: ${msg}`);
        }
      },
    }),
    getMessages: builder.query({
      query: ({ chatRoomId, params, reset }) =>
        `/api/message/${
          chatRoomId +
          (params ? "?" + new URLSearchParams(params).toString() : "")
        }`,
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (arg.reset) {
            dispatch(setMessages(data?.data));
          } else {
            dispatch(
              setMessages([...getState().message.messages, ...data.data])
            );
          }

          dispatch(setMessagesHasNextPage(data?.hasNextPage));
        } catch (error) {
          console.error(error);
          const status = error.error?.status || 500;
          const msg =
            error.error?.data?.error || "Failed to retrieve messages data";
          console.error(`Error ${status}: ${msg}`);
        }
      },
    }),
    sendMessage: builder.mutation({
      query: ({ message, sendTo }) => ({
        url: `/api/message/send/${sendTo}`,
        method: "POST",
        body: message,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setMessages([data.data?.message, ...getState().message.messages])
          );
          const contackData =
            getState().message.contacts.find(
              (val) => val.partnerChat?.email === arg.sendTo
            ) || getState().message.selectedContact;
          dispatch(
            setContacts([
              {
                ...contackData,
                latestMessage: arg.message?.text,
                isTherePicture: Boolean(arg.message?.image),
                latestMessageAt: data.data?.message.sentAt,
                unread: data.data?.unread,
              },
              ...getState().message.contacts.filter(
                (val) => val.partnerChat?.email !== arg.sendTo
              ),
            ])
          );
          console.log("200: " + data.message);
        } catch (error) {
          console.error(error);
          const status = error.error?.status || 500;
          const msg = error.error?.data?.error || "Failed to send message";
          console.error(`Error ${status}: ${msg}`);
        }
      },
    }),
    getSingleContact: builder.query({
      query: ({ recipientEmail }) => `/api/message/contact/${recipientEmail}`,
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const existingContact = getState().message.contacts.find(
            (contact) => contact.partnerChat.email === arg.recipientEmail
          );
          if (existingContact) {
            dispatch(setSelectedContact(existingContact));
          } else {
            const { data } = await queryFulfilled;
            dispatch(setSelectedContact(data?.data));
            console.log(data.data);
          }
          dispatch(setIsModalOpen(false));
          dispatch(setMessages([]));
          console.log(getState().message.selectedContact);
        } catch (error) {
          toastErrorHandler(error.error, "Failed to get contact");
        }
      },
    }),
    readMessage: builder.mutation({
      query: ({ chatRoomId }) => ({
        url: `/api/message/read/${chatRoomId}`,
        method: "PUT",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { meta } = await queryFulfilled;
          if (meta.response.status === 200) {
            dispatch(
              setContacts(
                getState().message.contacts.map((val) => {
                  if (val.chatRoomId === arg.chatRoomId) {
                    return {
                      ...val,
                      unread: 0,
                    };
                  }
                  return val;
                })
              )
            );
          }
        } catch (error) {
          const msg = error.data?.message || "Failed to read message";
          console.log(msg);
        }
      },
    }),
  }),
});

export const {
  useGetContactsQuery,
  useLazyGetContactsQuery,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useGetSingleContactQuery,
  useLazyGetSingleContactQuery,
  useReadMessageMutation,
} = messageApi;
