import { createSlice } from '@reduxjs/toolkit';

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    isFetching: false,
    error: false,
  },
  reducers: {
    //Get All Roles
    getRolesStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getRolesSuccess: (state, action) => {
      state.isFetching = false;
      state.roles = action.payload;
    },
    getRolesFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { getRolesStart, getRolesSuccess, getRolesFailure } =
  roleSlice.actions;

export default roleSlice.reducer;
