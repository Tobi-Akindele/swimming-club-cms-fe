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
    //Create Role
    createRoleStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    createRoleSuccess: (state, action) => {
      state.isFetching = false;
      state.roles.push(action.payload);
    },
    createRoleFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //Get Role by ID
    getRoleByIdStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getRoleByIdSuccess: (state, action) => {
      state.isFetching = false;
      state.role = action.payload;
    },
    getRoleByIdFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getRolesStart,
  getRolesSuccess,
  getRolesFailure,
  createRoleStart,
  createRoleSuccess,
  createRoleFailure,
  getRoleByIdStart,
  getRoleByIdSuccess,
  getRoleByIdFailure,
} = roleSlice.actions;

export default roleSlice.reducer;
