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
    //Register User
    registerUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    registerUserSuccess: (state, action) => {
      state.isFetching = false;
      state.users.push(action.payload);
    },
    registerUserFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //Update User
    updateUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateUserSuccess: (state, action) => {
      state.isFetching = false;
      state.users[
        state.users.findIndex((item) => item._id === action.payload._id)
      ] = action.payload;
    },
    updateUserFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  registerUserStart,
  registerUserSuccess,
  registerUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
