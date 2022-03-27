import { createSlice } from '@reduxjs/toolkit';

const userTypeSlice = createSlice({
  name: 'userType',
  initialState: {
    isFetching: false,
    error: false,
  },
  reducers: {
    //Get All User Types
    getUserTypesStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getUserTypesSuccess: (state, action) => {
      state.isFetching = false;
      state.userTypes = action.payload;
    },
    getUserTypesFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { getUserTypesStart, getUserTypesSuccess, getUserTypesFailure } =
  userTypeSlice.actions;

export default userTypeSlice.reducer;
