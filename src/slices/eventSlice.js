import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedMood: 2,
  title: '',
  note: '',
  location: '',
  bookmark: false,
  selectedMedia: [],
  selectedDocs: [],
  recordedAudio: null,
  editing: false,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEventState(state, action) {
        const event = action.payload;
        if (event && event._id) {
          // If payload is a complete event object
          return {
            ...state,
            selectedMood: event.mood,
            title: event.title,
            note: event.note,
            location: event.location,
            bookmark: event.bookmark,
            selectedMedia: [...event.media.image, ...event.media.video],
            selectedDocs: event.media.documents,
            recordedAudio: event.media.voice.length > 0 ? event.media.voice[0] : null,
            editing: false,
          };
        } else {
          // If payload contains individual field updates
          return { ...state, ...event };
        }
      },
    resetEventState() {
      return initialState;
    },
  },
});

export const { setEventState, resetEventState } = eventSlice.actions;

export default eventSlice.reducer;
