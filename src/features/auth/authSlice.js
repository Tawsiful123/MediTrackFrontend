import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  needsPasswordChange: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.needsPasswordChange = action.payload.needsPasswordChange ?? false;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.needsPasswordChange = false;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setAccessToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;