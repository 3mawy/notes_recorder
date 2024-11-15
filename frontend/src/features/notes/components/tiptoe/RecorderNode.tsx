import { Node as TiptapNode } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import RecorderComponent from "./RecorderComponent";
import type React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import type { Editor } from "@tiptap/core";

interface AudioRecorderComponentProps extends NodeViewProps {
  deleteNode: () => void;
  editor: Editor;
}

export const AudioRecorderComponent: React.FC<AudioRecorderComponentProps> = ({ deleteNode, editor }) => {
  const handleRecordingStop = (recordedBlob: { blobURL: string; blob: Blob; id: number }) => {
    // Delete the recorder node
    deleteNode();

    // editor.commands.insertContent(" ");

    // Insert the audio element with placeholder tag
    editor.commands.insertContent({
      type: "audio",
      attrs: {
        src: recordedBlob.blobURL,
        id: `[TEMP_AUDIO_${recordedBlob?.id}]`,
      },
    });

    // editor.commands.insertContent(" ");
  };

  return (
    <NodeViewWrapper>
      <div contentEditable={false}>
        <RecorderComponent onRecordingStop={handleRecordingStop} />
      </div>
    </NodeViewWrapper>
  );
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audioRecorder: {
      insertAudioRecorder: () => ReturnType;
    };
  }
}

// Create the TipTap node
export const EditorAudioRecorderNode = TiptapNode.create({
  name: "recorder",
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
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="audioRecorder"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "audioRecorder", ...HTMLAttributes }];
  },

  addCommands() {
    return {
      insertAudioRecorder:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioRecorderComponent, {
      as: "div",
      className: "audio-recorder-node",
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;
        const nodeBefore = $from.nodeBefore;
        //TODO handle preventing deletion
        console.log(editor.$node("audioRecorder"));
        console.log(selection);
        console.log(nodeBefore);
        console.log(nodeBefore);
        // Prevent deleting the audio recorder node if backspace is pressed
        return selection.empty && nodeBefore?.type?.name === "audioRecorder";
      },
    };
  },
});
