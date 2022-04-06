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
    //Delete Event
    deleteEventsStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteEventsSuccess: (state, action) => {
      state.isFetching = false;
      state.competitions = state.competitions.map((comp) => {
        if (comp._id === action.payload.competitionId) {
          if (comp.events && comp.events.length) {
            const newEvents = comp.events.filter((ev) => {
              return !action.payload.eventIds.includes(ev._id);
            });
            comp.events = newEvents;
            return comp;
          }
          return comp;
        } else {
          return comp;
        }
      });
    },
    deleteEventsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    createEventStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    createEventSuccess: (state, action) => {
      state.isFetching = false;
      state.competitions = state.competitions.map((comp) => {
        if (comp._id === action.payload.competitionId) {
          if (comp.events && comp.events.length) {
            comp.events.push(action.payload);
            return comp;
          } else {
            comp.events = [];
            comp.events.push(action.payload);
            return comp;
          }
        } else {
          return comp;
        }
      });
    },
    createEventFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    addEventParticipantStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    addEventParticipantSuccess: (state, action) => {
      state.isFetching = false;
      state.competitions = state.competitions.map((comp) => {
        if (comp._id === action.payload.competitionId) {
          if (comp.events && comp.events.length) {
            comp.events = comp.events.map((event) =>
              event._id !== action.payload._id ? event : action.payload
            );
            return comp;
          } else {
            comp.events = [];
            comp.events.push(action.payload);
            return comp;
          }
        } else {
          return comp;
        }
      });
    },
    addEventParticipantFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    deleteEventParticipantStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteEventParticipantSuccess: (state, action) => {
      state.isFetching = false;
      state.competitions = state.competitions.map((comp) => {
        if (comp._id === action.payload.competitionId) {
          if (comp.events && comp.events.length) {
            comp.events = comp.events.map((event) =>
              event._id !== action.payload._id ? event : action.payload
            );
            return comp;
          } else {
            comp.events = [];
            comp.events.push(action.payload);
            return comp;
          }
        } else {
          return comp;
        }
      });
    },
    deleteEventParticipantFailure: (state) => {
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
  deleteEventsStart,
  deleteEventsSuccess,
  deleteEventsFailure,
  createEventStart,
  createEventSuccess,
  createEventFailure,
  addEventParticipantStart,
  addEventParticipantSuccess,
  addEventParticipantFailure,
  deleteEventParticipantStart,
  deleteEventParticipantSuccess,
  deleteEventParticipantFailure,
} = competitionSlice.actions;

export default competitionSlice.reducer;
