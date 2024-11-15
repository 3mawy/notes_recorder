import type { FC } from "react";
import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import NoNotesFound from "./NoNotesFound";
import type { NoteRead } from "../services/noteTypes";

interface NotesSidebarProps {
  notes: NoteRead[] | undefined;
  selectedNoteId: number | null;
  // eslint-disable-next-line no-unused-vars
  onSelectNote: (noteId: number) => void;
  isDrawerOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  toggleDrawer: (open: boolean) => () => void;
  isMobile: boolean;
}

export const NotesSidebar: FC<NotesSidebarProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  isDrawerOpen,
  toggleDrawer,
  isMobile,
}) => (
  <Drawer
    anchor="left"
    open={isDrawerOpen}
    onClose={isMobile ? toggleDrawer(false) : undefined}
    sx={{ display: { xs: isMobile ? "block" : "none", md: "block" } }}
  >
    <Box sx={{ width: 250, pt: 8 }} role="presentation">
      <List>
        {notes?.length ? (
          notes.map((note) => (
            <React.Fragment key={note.id}>
              <ListItemButton
                component="div"
                onClick={() => {
                  onSelectNote(note.id);
                  if (isMobile) toggleDrawer(false)();
                }}
                selected={note.id === selectedNoteId}
                sx={{ cursor: "pointer" }}
              >
                <ListItemText
                  primary={note.title}
                  style={{
                    fontWeight: "bold",
                  }}
                  secondary={`Created: ${new Date(note.created_at).toLocaleDateString()}`}
                />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <NoNotesFound />
        )}
      </List>
    </Box>
  </Drawer>
);
