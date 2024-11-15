import { notesApi } from "../../../services/notesApi";

import type {
  NotesCreateApiArg,
  NotesCreateApiResponse, NotesDestroyApiArg, NotesDestroyApiResponse,
  NotesListApiArg,
  NotesListApiResponse, NotesPartialUpdateApiArg,
  NotesPartialUpdateApiResponse,
  NotesRetrieveApiArg,
  NotesRetrieveApiResponse,
  NotesUpdateApiArg,
  NotesUpdateApiResponse
} from "./noteTypes";

// Inject the endpoint to the base api
const noteEndpoints = notesApi.injectEndpoints({
  endpoints: (build) => ({
    notesList: build.query<NotesListApiResponse, NotesListApiArg>({
      query: (queryArg) => ({
        url: `/api/notes/`,
        params: {
          ...queryArg,
          limit: queryArg.limit,
          offset: queryArg.offset,
          type: queryArg.type,
        },
      }),
      providesTags: ["NoteList"],
    }),
    notesCreate: build.mutation<NotesCreateApiResponse, NotesCreateApiArg>({
      query: (queryArg) => ({ url: `/api/notes/`, method: "POST", body: queryArg.noteRequest }),
      invalidatesTags: ["NoteList"],
    }),
    notesRetrieve: build.query<NotesRetrieveApiResponse, NotesRetrieveApiArg>({
      query: (queryArg) => ({ url: `/api/notes/${queryArg.id}/` }),
    }),
    notesUpdate: build.mutation<NotesUpdateApiResponse, NotesUpdateApiArg>({
      query: (queryArg) => ({ url: `/api/notes/${queryArg.id}/`, method: "PUT", body: queryArg.noteRequest }),
      invalidatesTags: ["NoteList"],

    }),
    notesPartialUpdate: build.mutation<NotesPartialUpdateApiResponse, NotesPartialUpdateApiArg>({
      query: (queryArg) => ({ url: `/api/notes/${queryArg.id}/`, method: "PATCH", body: queryArg.patchedNoteRequest }),
      invalidatesTags: ["NoteList"],

    }),
    notesDestroy: build.mutation<NotesDestroyApiResponse, NotesDestroyApiArg>({
      query: (queryArg) => ({ url: `/api/notes/${queryArg.id}/`, method: "DELETE" }),
      invalidatesTags: ["NoteList"],

    }),
  }),
});

//Export the endpoints
export const {
  useNotesListQuery,
  useNotesCreateMutation,
  useNotesRetrieveQuery,
  useNotesUpdateMutation,
  useNotesPartialUpdateMutation,
  useNotesDestroyMutation,
} = noteEndpoints;
