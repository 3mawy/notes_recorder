import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {useNotesRetrieveQuery} from "../services/noteEndpoints";
import NoteEditor from "./tiptoe/NoteEditor/NoteEditor";
import Box from "@mui/material/Box";

const NoteDetails = ({noteId}: { noteId: number }) => {
    const {data: note, isLoading, error} = useNotesRetrieveQuery({id: noteId});

    if (isLoading) {
        return <Box sx={{
            display: "flex",
            height: "100%"
            , justifyContent: "space-around",
            alignItems: "center"
        }}><CircularProgress/></Box>;
    }

    if (error) {
        return <Typography color="error">An error occurred while fetching note details.</Typography>;
    }

    if (!note) {
        return <Typography>No note details available.</Typography>;
    }

    return (
        <NoteEditor
            noteId={note.id}
            description={note.description}
            audioRecordings={note.audio_recordings}
            title={note.title}
        />
    );
};

export default NoteDetails;
