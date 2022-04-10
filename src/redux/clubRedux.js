import { createSlice } from '@reduxjs/toolkit';

const clubSlice = createSlice({
  name: 'club',
  initialState: {
    isFetching: false,
    error: false,
  },
  reducers: {
    //Get All Clubs
    getAllClubsStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getAllClubssSuccess: (state, action) => {
      state.isFetching = false;
      state.clubs = action.payload;
    },
    getAllClubsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //Create Club
    createClubStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    createClubSuccess: (state, action) => {
      state.isFetching = false;
      state.clubs.push(action.payload);
    },
    createClubFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getAllClubsStart,
  getAllClubssSuccess,
  getAllClubsFailure,
  createClubStart,
  createClubSuccess,
  createClubFailure,
} = clubSlice.actions;

export default clubSlice.reducer;
