import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setContacts,
  setContactsHasNextPage,
  setMessages,
  setMessagesHasNextPage,
} from "../store/messageSlice.js";

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
          const { message, data } = await queryFulfilled;
          dispatch(setMessages([data.data, ...getState().message.messages]));
          const contackData = getState().message.contacts.find(
            (val) => val.partnerChat?.email === arg.sendTo
          );
          dispatch(
            setContacts([
              {
                ...contackData,
                latestMessage: arg.message?.text,
                isTherePicture: Boolean(arg.message?.image),
              },
              ...getState().message.contacts.filter(
                (val) => val.partnerChat?.email !== arg.sendTo
              ),
            ])
          );
          console.log("200: " + message);
        } catch (error) {
          console.error(error);
          const status = error.error?.status || 500;
          const msg = error.error?.data?.error || "Failed to send message";
          console.error(`Error ${status}: ${msg}`);
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
} = messageApi;
