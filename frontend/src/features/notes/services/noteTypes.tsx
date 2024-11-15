export const noteTagTypes: NoteTagType[] = ["NoteList"];
export type NoteTagType = "NoteList";
export type NoteDetailTagType = "NoteDetail";

export type NotesListApiResponse = /** status 200  */ PaginatedNoteListRead;
export type NotesListApiArg = {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  type?: string;
  search?: string;
};
export type NotesCreateApiResponse = /** status 201  */ NoteRead;
export type NotesCreateApiArg = {
  noteRequest: NoteRequest;
};
export type NotesRetrieveApiResponse = /** status 200  */ NoteRead;
export type NotesRetrieveApiArg = {
  /** A unique integer value identifying this note. */
  id: number;
};
export type NotesUpdateApiResponse = /** status 200  */ NoteRead;
export type NotesUpdateApiArg = {
  /** A unique integer value identifying this note. */
  id: number;
  noteRequest: NoteRequest;
};
export type NotesPartialUpdateApiResponse = /** status 200  */ NoteRead;
export type NotesPartialUpdateApiArg = {
  /** A unique integer value identifying this note. */
  id: number;
  patchedNoteRequest: PatchedNoteRequest;
};
export type NotesDestroyApiResponse = unknown;
export type NotesDestroyApiArg = {
  /** A unique integer value identifying this note. */
  id: number;
};
export type TypeEnum = "text" | "memo";
export type Note = {
  title: string;
  description: string;
  type?: TypeEnum;
  user: number;
};
export type AudioRecording = {
  audio_file: string;
  note: number;
};
export type AudioRecordingRead = {
  id: number;
  created_at: string;
  updated_at: string;
  audio_file: string;
  note: number;
};
export type NoteRead = {
  id: number;
  audio_recordings: AudioRecordingRead[];
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  type?: TypeEnum;
  user: number;
};
export type PaginatedNoteList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Note[];
};
export type PaginatedNoteListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: NoteRead[];
};
export type NoteRequest = {
  title?: string;
  description: string;
  type?: TypeEnum;
  user?: number;
  deleted_audio_ids?:number[]
};
export type PatchedNoteRequest = {
  title?: string;
  description?: string;
  type?: TypeEnum;
  user?: number;
};