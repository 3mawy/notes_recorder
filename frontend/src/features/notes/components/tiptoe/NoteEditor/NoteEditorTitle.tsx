import type { FC } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface NoteEditorTitleProps {
  noteTitle: string;
  // eslint-disable-next-line no-unused-vars
  setNoteTitle: (title: string) => void;
}

const NoteEditorTitle: FC<NoteEditorTitleProps> = ({ noteTitle, setNoteTitle }) => {
  const theme = useTheme();

  return (
    <Box
      component="input"
      id="title"
      type="text"
      value={noteTitle}
      onChange={(e) => setNoteTitle(e.target.value)}
      placeholder="Enter note title"
      sx={{
        padding: "10px",
        fontWeight: "bold",
        fontSize: "16px",
        border: "none",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    />
  );
};

export default NoteEditorTitle;
