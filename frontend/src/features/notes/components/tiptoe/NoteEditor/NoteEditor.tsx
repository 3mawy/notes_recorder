import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNotesUpdateMutation } from "../../../services/noteEndpoints";
import { selectDeletedAudioIds, selectRecordings, clearRecordings, clearDeletedAudioIds } from "../../../audioSlice";
import { useAppSelector, useAppDispatch } from "../../../../../store/hooks/storeHooks";
import Box from "@mui/material/Box";
import NoteEditorHeader from "./NoteEditorHeader";
import type { NoteRequest } from "../../../services/noteTypes";
import NoteEditorTitle from "./NoteEditorTitle";
import NoteEditorContent from "./NoteEditorContent";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorAudioNode } from "../AudioNode";
import { EditorAudioRecorderNode } from "../RecorderNode";

interface NoteEditorProps {
  title: string;
  description: string;
  audioRecordings: { id: number; audio_file: string }[];
  noteId: number;
}

const NoteEditor: FC<NoteEditorProps> = ({ description, audioRecordings, noteId, title }) => {
  const [noteTitle, setNoteTitle] = useState(title);
  const [updateNote, { isLoading: isUpdating }] = useNotesUpdateMutation();
  const [currentDescription, setCurrentDescription] = useState(description);
  const deletedAudioIds = useAppSelector(selectDeletedAudioIds);
  const recordings = useAppSelector(selectRecordings);
  const dispatch = useAppDispatch();

  const handleSave = async () => {
    if (currentDescription && editor) {
      const formData = new FormData();

      const updatedContent = editor.getHTML();
      if (recordings.length > 0) {
        for (let i = 0; i < recordings.length; i++) {
          const audio = recordings[i];
          try {
            const byteString = atob(audio.audioData.split(",")[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let j = 0; j < byteString.length; j++) {
              ia[j] = byteString.charCodeAt(j);
            }

            const audioBlob = new Blob([ab], { type: "audio/wav" });
            const file = new File([audioBlob], `recording-${audio.id}.wav`, { type: "audio/wav" });

            const placeholderTag = `[TEMP_AUDIO_${audio.id}]`;

            formData.append(`audio_recordings[${i}][file]`, file);
            formData.append(`audio_recordings[${i}][name]`, placeholderTag);
          } catch (error) {
            console.error("Error processing audio:", error);
          }
        }
      }

      formData.append("description", updatedContent);
      formData.append("title", noteTitle);

      // Add deleted audio IDs
      if (deletedAudioIds.length > 0) {
        deletedAudioIds.forEach((id) => {
          formData.append("deleted_audio_ids", id.toString());
        });
      }

      try {
        await updateNote({
          id: noteId,
          noteRequest: formData as unknown as NoteRequest,
        }).unwrap();

        // Clear recordings and deleted IDs after successful save
        dispatch(clearRecordings());
        dispatch(clearDeletedAudioIds());
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, EditorAudioNode, EditorAudioRecorderNode],
    content: description || "<p>Write your note here...</p>",
    onUpdate: ({ editor }) => {
      setCurrentDescription(editor.getHTML());
    },
  });

  const handleAddAudioTag = () => {
    if (editor) {
      editor.commands.insertAudioRecorder();
    }
  };
  useEffect(() => {
    setNoteTitle(title);
  }, [title]);

  return (
    <Box
      className="note-editor"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        paddingTop: "0.6rem",
        borderRadius: "8px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 20px",
        backgroundColor: "var(--bg-editor-color)",
        minHeight: "100% ",
        maxHeight: "100% ",
        width: "100% ",
        margin: "auto",
      }}
    >
      <NoteEditorHeader
        noteId={noteId}
        handleAddAudioTag={handleAddAudioTag}
        handleSave={handleSave}
        isUpdating={isUpdating}
        isDeleting={false}
      />
      <NoteEditorTitle noteTitle={noteTitle} setNoteTitle={setNoteTitle} />
      <NoteEditorContent editor={editor} description={description} audioRecordings={audioRecordings} />
    </Box>
  );
};

export default NoteEditor;
