import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { theme: localStorage.getItem("chat-theme") || null },
  reducers: {
    changeTheme: (state) => {
      const theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("chat-theme", theme);
      return { ...state, theme };
    },
  },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;
