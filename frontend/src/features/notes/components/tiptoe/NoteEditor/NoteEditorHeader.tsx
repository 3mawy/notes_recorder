import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import Mic from "@mui/icons-material/Mic";
import Save from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import { useNotesDestroyMutation } from "../../../services/noteEndpoints";

interface NoteEditorHeaderProps {
  noteId: number;
  handleAddAudioTag: () => void;
  handleSave: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const NoteEditorHeader: FC<NoteEditorHeaderProps> = ({
  noteId,
  handleAddAudioTag,
  handleSave,
  isUpdating,
  isDeleting,
}) => {
  const navigate = useNavigate();
  const [deleteNote] = useNotesDestroyMutation();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote({ id: noteId }).unwrap();
        navigate("/notes");
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", paddingX: "1rem" }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <IconButton color="error" onClick={handleDelete} disabled={isDeleting}>
          <Delete />
        </IconButton>
        {isDeleting && <CircularProgress sx={{ position: "absolute", top: 10, left: 10, zIndex: 1 }} size={20} />}
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <IconButton onClick={handleAddAudioTag}>
          <Mic />
        </IconButton>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <IconButton onClick={handleSave} disabled={isUpdating}>
            <Save />
          </IconButton>
          {isUpdating && <CircularProgress sx={{ position: "absolute", top: 10, left: 10, zIndex: 1 }} size={20} />}
        </Box>
      </Box>
    </Box>
  );
};

export default NoteEditorHeader;
