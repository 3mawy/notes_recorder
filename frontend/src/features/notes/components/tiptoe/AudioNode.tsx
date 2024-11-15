import { Node as TiptapNode } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AudioComponent } from "./AudioComponent";

export const EditorAudioNode = TiptapNode.create({
  name: "audio",
  group: "inline",
  inline: true,
  atom: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      id: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("id");
        },
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return {
            id: attributes.id,
          };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "audio[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    // Convert the audio node to an audioRecorder tag with placeholder ID when saving
    if (HTMLAttributes.id?.startsWith("[TEMP_AUDIO_")) {
      return ["audioRecorder", { id: HTMLAttributes.id }];
    }
    // For existing audio files, keep them as audio tags
    return ["audio", HTMLAttributes];
  },
  addNodeView() {
    return ReactNodeViewRenderer(AudioComponent);
  },
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;
        const nodeBefore = $from.nodeBefore;

        // Prevent deleting the audio node if backspace is pressed
        return selection.empty && nodeBefore?.type?.name === "audio";
      },
    };
  },
});
