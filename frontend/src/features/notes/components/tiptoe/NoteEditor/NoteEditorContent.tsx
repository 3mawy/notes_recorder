import type { FC } from "react";
import { useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { Editor } from "@tiptap/core";

interface NoteEditorContentProps {
  editor: Editor | null;
  description: string;
  audioRecordings: { id: number; audio_file: string }[];
}

const NoteEditorContent: FC<NoteEditorContentProps> = ({ editor, description, audioRecordings }) => {
  useEffect(() => {
    if (editor) {
      let updatedContent = description;
      audioRecordings?.forEach((recording) => {
        const audioPlaceholder = `[AUDIO_${recording.id}]`;
        const audioHTML = `<audio src="${recording.audio_file}" controls></audio>`;
        updatedContent = updatedContent.replace(audioPlaceholder, audioHTML);
      });
      editor.commands.setContent(updatedContent);
    }
  }, [editor, description, audioRecordings]);

  const theme = useTheme();
  return (
    <Box
      className="editor-container"
      sx={{
        background: theme.palette.background.paper,
        padding: "10px",
        borderRadius: "4px",
        overflow: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        position: "relative",
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

export default NoteEditorContent;
