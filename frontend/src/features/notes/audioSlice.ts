import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store/rootStore";

interface AudioRecording {
  id: number;
  audioData: string;
  name: string;
  blobURL: string;
}

interface AudioState {
  deletedAudioIds: number[];
  isInitRecord: boolean;
  isRecording: boolean;
  recordings: AudioRecording[];
}

const initialState: AudioState = {
  deletedAudioIds: [],
  isInitRecord: false,
  isRecording: false,
  recordings: [],
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addDeletedAudioId: (state, action: PayloadAction<number>) => {
      state.deletedAudioIds.push(action.payload);
    },
    clearDeletedAudioIds: (state) => {
      state.deletedAudioIds = [];
    },
    addRecording: (state, action: PayloadAction<AudioRecording>) => {
      state.recordings.push(action.payload);
    },
    clearRecordings: (state) => {
      // Clean up blob URLs before clearing
      state.recordings.forEach((recording) => {
        URL.revokeObjectURL(recording.blobURL);
      });
      state.recordings = [];
    },
  },
});

export const { addDeletedAudioId, clearDeletedAudioIds, addRecording, clearRecordings } = audioSlice.actions;
export const selectDeletedAudioIds = (state: RootState) => state.audio.deletedAudioIds;
export const selectRecordings = (state: RootState) => state.audio.recordings;
export const selectIsInitRecord = (state: RootState) => state.audio.isInitRecord;
export const selectIsRecording = (state: RootState) => state.audio.isRecording;

export const audioReducer = audioSlice.reducer;
