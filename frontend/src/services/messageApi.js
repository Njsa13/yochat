import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  deleteContacts,
  setContacts,
  setContactsHasNextPage,
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
            dispatch(setContacts(data.data));
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
  }),
});

export const { useGetContactsQuery, useLazyGetContactsQuery } = messageApi;
