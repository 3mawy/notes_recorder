import type { FC } from "react";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";

import { useNotesCreateMutation, useNotesListQuery } from "../services/noteEndpoints";
import NoteDetails from "../components/NotesDetails";
import NoNotesFound from "../components/NoNotesFound";
import SearchBar from "../../../components/ui/search/SearchBar";
import { NotesSidebar } from "../components/NotesSidebar";
import type { NoteRequest, NoteRead } from "../services/noteTypes";

type NotesListProps = object;

const NotesList: FC<NotesListProps> = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const {
    data: notesData,
    error: notesError,
    isLoading: notesLoading,
    refetch,
  } = useNotesListQuery({ offset: 0, search: searchText });

  const [addNote] = useNotesCreateMutation();

  useEffect(() => {
    refetch();
  }, [searchText, refetch]);

  useEffect(() => {
    if (selectedNoteId && notesData?.results) {
      const noteExists = notesData.results.some((note) => note.id === selectedNoteId);
      if (!noteExists) {
        setSelectedNoteId(null);
      }
    }
  }, [notesData, selectedNoteId]);

  useEffect(() => {
    if (notesData?.results.length) {
      setSelectedNoteId(notesData.results[0].id);
    }
  }, [notesData]);

  const addNewNoteOrMemo = async () => {
    const formData = new FormData();
    formData.append("title", "New Note");
    formData.append("description", "Note Description ...");
    const response = await addNote({
      noteRequest: formData as unknown as NoteRequest,
    }).unwrap();
    setSelectedNoteId(response.id);
  };

  const toggleDrawer = (open: boolean) => () => setIsDrawerOpen(open);

  const handleSearch = (searchValue: string) => setSearchText(searchValue);

  if (notesLoading) {
    return <CircularProgress />;
  }

  if (notesError) {
    return <Typography color="error">An error occurred while fetching data.</Typography>;
  }

  return (
    <Box
      sx={{
        marginTop: 0,
        paddingY: { md: 4 },
        paddingX: { sm: 3 },
        display: "flex",
        flexDirection: "row",
        gap: 3,
        maxWidth: "100%",
        minHeight: "100%",
      }}
    >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{
          zIndex: 9999,
          height: "2.5rem",
          display: { xs: "block", md: "none" },
          position: "fixed",
          top: 10,
          left: 16,
        }}
      >
        <MenuIcon />
      </IconButton>

      <NotesSidebar
        notes={notesData?.results}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        isMobile
      />

      <Box sx={{ width: "30%", display: { xs: "none", md: "flex" }, flexDirection: "column", overflow: "auto" }}>
        <AddNoteButton onClick={addNewNoteOrMemo} />
        <Box sx={{ overflowY: "auto", marginTop: "1rem", flexGrow: 1 }}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              display: "flex",
              height: "100%",
            }}
          >
            <SearchBar onSearch={handleSearch} debounceDelay={300} />
            <NoteList notes={notesData?.results} selectedNoteId={selectedNoteId} onSelectNote={setSelectedNoteId} />
          </Card>
        </Box>
      </Box>

      <Box sx={{ flex: 1, padding: { xs: 1, md: 0 } }}>
        {selectedNoteId ? (
          <NoteDetails noteId={selectedNoteId} />
        ) : notesData?.results.length ? (
          <Typography sx={{ mt: 2 }}>Select a note to view details</Typography>
        ) : (
          <NoNotesFound />
        )}
      </Box>
    </Box>
  );
};

export default NotesList;

type NoteListItemProps = {
  note: NoteRead;
  selectedNoteId: number | null;
  // eslint-disable-next-line no-unused-vars
  onSelectNote: (id: number) => void;
};

type AddNoteButtonProps = {
  onClick: () => void;
};

type NoteListProps = {
  notes: NoteRead[] | undefined;
  selectedNoteId: number | null;
  // eslint-disable-next-line no-unused-vars
  onSelectNote: (id: number) => void;
};
const NoteListItem: FC<NoteListItemProps> = ({ note, selectedNoteId, onSelectNote }) => (
  <React.Fragment>
    <ListItemButton
      component="div"
      onClick={() => onSelectNote(note.id)}
      selected={note.id === selectedNoteId}
      sx={{ cursor: "pointer" }}
    >
      <ListItemText
        primary={note.title}
        secondary={`Created: ${new Date(note.created_at).toLocaleDateString()}`}
        primaryTypographyProps={{
          sx: {
            fontWeight: note.id === selectedNoteId ? 600 : 400,
            fontSize: "0.95rem",
          },
        }}
        secondaryTypographyProps={{
          sx: {
            fontSize: "0.8rem",
          },
        }}
      />
    </ListItemButton>
    <Divider />
  </React.Fragment>
);

const AddNoteButton: FC<AddNoteButtonProps> = ({ onClick }) => (
  <Button
    sx={{
      backgroundColor: "#6200ea",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      cursor: "pointer",
      fontSize: "16px",
      "&:hover": {
        backgroundColor: "#3700b3",
      },
    }}
    onClick={onClick}
    fullWidth
  >
    + Add New Note
  </Button>
);

const NoteList: FC<NoteListProps> = ({ notes, selectedNoteId, onSelectNote }) => (
  <List sx={{ overflowY: "auto" }}>
    {notes && notes.length > 0 ? (
      notes.map((note) => (
        <NoteListItem key={note.id} note={note} selectedNoteId={selectedNoteId} onSelectNote={onSelectNote} />
      ))
    ) : (
      <NoNotesFound />
    )}
  </List>
);
