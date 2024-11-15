import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { useNotesCreateMutation } from "../services/noteEndpoints";

const NoNotesFound = () => {
  const [notesCreate] = useNotesCreateMutation();

  const handleAddNote = async () => {
    try {
      // This will call the mutation with some sample data
      await notesCreate({ noteRequest: { title: "New Note", description: "This is a new note." } }).unwrap();
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <Typography variant="h6" gutterBottom>
        No Notes Found
      </Typography>
      <Typography variant="body2" gutterBottom>
        You haven&#39;t created any notes yet. Start by adding a new note.
      </Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddNote} sx={{ marginTop: 2 }}>
        Add Note
      </Button>
    </Box>
  );
};

export default NoNotesFound;
