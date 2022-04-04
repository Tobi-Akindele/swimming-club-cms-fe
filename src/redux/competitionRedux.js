import { createSlice } from '@reduxjs/toolkit';

const competitionSlice = createSlice({
  name: 'competition',
  initialState: {
    isFetching: false,
    error: false,
  },
  reducers: {
    //Get All Competitions
    getCompetitionsStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getCompetitionsSuccess: (state, action) => {
      state.isFetching = false;
      state.competitions = action.payload;
    },
    getCompetitionsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //Create Competition
    createCompetitionStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    createCompetitionSuccess: (state, action) => {
      state.isFetching = false;
      state.competitions.push(action.payload);
    },
    createCompetitionsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //Delete Competitions
    deleteCompetitionsStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteCompetitionsSuccess: (state, action) => {
      state.isFetching = false;
      state.competitions.splice(
        state.competitions.findIndex((item) =>
          action.payload.includes(item._id)
        ),
        1
      );
    },
    deleteCompetitionsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getCompetitionsStart,
  getCompetitionsSuccess,
  getCompetitionsFailure,
  createCompetitionStart,
  createCompetitionSuccess,
  createCompetitionsFailure,
  deleteCompetitionsStart,
  deleteCompetitionsSuccess,
  deleteCompetitionsFailure,
} = competitionSlice.actions;

export default competitionSlice.reducer;
