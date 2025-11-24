import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-hot-toast";

import {
  setCredentials,
  logout,
  connectSocket,
  disconnectSocket,
} from "../store/authSlice.js";
import { toastErrorHandler } from "./handler.js";
import {
  subsToFriendStatus,
  unSubsToFriendStatus,
} from "../store/messageSlice.js";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.query({
      query: () => "/api/auth/logout",
      async onQueryStarted(arg, { dispatch, getState }) {
        try {
          dispatch(logout());
          dispatch(unSubsToFriendStatus(getState().auth.socket));
          dispatch(disconnectSocket());
        } catch (error) {
          toastErrorHandler(error.error, "Logout failed");
        }
      },
    }),
    sendEmailVerification: builder.mutation({
      query: ({ email }) => ({
        url: `/api/auth/send-verification-email?email=${encodeURIComponent(
          email
        )}`,
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const message = data?.message;
          toast.success(`${message}`);
        } catch (error) {
          toastErrorHandler(error.error, "Failed to send verification email");
        }
      },
    }),
    verifyEmail: builder.mutation({
      query: ({ token }) => ({
        url: `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        method: "PUT",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data?.data));
          dispatch(connectSocket());
          dispatch(subsToFriendStatus(getState().auth.socket));
        } catch (error) {
          toastErrorHandler(error.error, "Failed to verify email");
        }
      },
    }),
    checkAuth: builder.query({
      query: () => "/api/auth/check-auth",
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data?.data));
          dispatch(connectSocket());
          dispatch(subsToFriendStatus(getState().auth.socket));
        } catch (error) {
          const status = error.error?.status || 500;
          const msg =
            error.error?.data?.error || "Failed to retrieve user data";
          console.error(`Error ${status}: ${msg}`);
        }
      },
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: "/api/auth/update-profile",
        method: "PUT",
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success("200: " + data?.message);
        } catch (error) {
          toastErrorHandler(error.error, "Failed to update profile");
        }
      },
    }),
    updateProfilePic: builder.mutation({
      query: (picture) => ({
        url: "/api/auth/update-profile-pic",
        method: "PUT",
        body: picture,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success("200: " + data?.message);
        } catch (error) {
          toastErrorHandler(error.error, "Failed to update profile picture");
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutQuery,
  useSendEmailVerificationMutation,
  useVerifyEmailMutation,
  useCheckAuthQuery,
  useUpdateProfileMutation,
  useUpdateProfilePicMutation,
} = authApi;
