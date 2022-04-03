import { createSlice } from '@reduxjs/toolkit';

const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    isFetching: false,
    error: false,
  },
  reducers: {
    //Get All Permissions
    getAllPermissionsStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getAllPermissionsSuccess: (state, action) => {
      state.isFetching = false;
      state.permissions = action.payload;
    },
    getAllPermissionsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getAllPermissionsStart,
  getAllPermissionsSuccess,
  getAllPermissionsFailure,
} = permissionSlice.actions;

export default permissionSlice.reducer;
