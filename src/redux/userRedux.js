import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isFetching: false,
    error: false,
  },
  reducers: {
    //Get All Users
    getUsersStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.users = action.payload;
    },
    getUsersFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //Get User by Username
    getUserByUsernameStart: (state) => {
      state.isFetchingUsername = true;
      state.error = false;
    },
    getUserByUsernameSuccess: (state, action) => {
      state.isFetchingUsername = false;
      state.username = action.payload;
    },
    getUserByUsernameFailure: (state) => {
      state.isFetchingUsername = false;
      state.error = true;
    },
    //Get User by Email
    getUserByEmailStart: (state) => {
      state.isFetchingEmail = true;
      state.error = false;
    },
    getUserByEmailSuccess: (state, action) => {
      state.isFetchingEmail = false;
      state.email = action.payload;
    },
    getUserByEmailFailure: (state) => {
      state.isFetchingEmail = false;
      state.error = true;
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  getUserByUsernameStart,
  getUserByUsernameSuccess,
  getUserByUsernameFailure,
  getUserByEmailStart,
  getUserByEmailSuccess,
  getUserByEmailFailure,
} = userSlice.actions;

export default userSlice.reducer;
