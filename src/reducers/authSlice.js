import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../utils/constants";

const initialState = {
  user: null,
  logoutLoading: false,
};

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { getState }) => {
    const state = getState();
    const user = state.user.user;
    
    if (user?.token) {
      try {
        await axios.post(`${API_URL}admin/logout`, {}, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with logout even if API fails
      }
    }
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove("user");
    
    return null;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      Cookies.set("user", JSON.stringify(action.payload));
    },

    logout(state) {
      localStorage.removeItem("user");
      Cookies.remove("user");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.logoutLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.logoutLoading = false;
      });
  },
});

export const { addUser, logout } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectLogoutLoading = (state) => state.user.logoutLoading;
export default userSlice.reducer;