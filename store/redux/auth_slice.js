import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      console.log(`[Redux] Saved user token: ${action.payload}`);
    },
    setUser(state, action) {
      state.user = action.payload;
      console.log("[Redux] Saved user data");
    },
    clearToken(state) {
      state.token = null;
      state.user = null;
      console.log("[Redux] Deleted user token and data");
    },
  },
});

export const { setToken, setUser, clearToken } = authSlice.actions;
export default authSlice.reducer;
