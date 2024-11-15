import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import type { FC } from "react";
import { useRef, useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch } from "../../../../store/hooks/storeHooks";
import { addDeletedAudioId } from "../../audioSlice";
import type H5AudioPlayer from "react-h5-audio-player";

export const AudioComponent: FC<NodeViewProps> = ({ node, editor, getPos }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const player = useRef<H5AudioPlayer>(null);

  const handleDelete = () => {
    const audioId = extractAudioId(node.attrs.src);
    if (audioId) {
      dispatch(addDeletedAudioId(parseInt(audioId)));
    }

    if (typeof getPos === "function") {
      const transaction = editor.state.tr.delete(getPos(), getPos() + node.nodeSize);
      editor.view.dispatch(transaction);
    }
  };

  const extractAudioId = (src: string): string | null => {
    const match = src.match(/\[AUDIO_(\d+)\]/);
    return match ? match[1] : null;
  };

  const getAudioSource = (src: string): string => {
    if (src.startsWith("blob:") || src.startsWith("http")) {
      return src;
    }

    if (src.startsWith("/")) {
      return `${import.meta.env.VITE_NOTES_BASE_URL}${src}`;
    }
    return src;
  };

  const handlePlayPause = () => {
    const audio = player.current?.audio.current;

    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
        setIsEnded(false);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleReplay = () => {
    const audio = player.current?.audio.current;

    if (audio) {
      audio.currentTime = 0; // Reset audio to the beginning
      audio.play();
      setIsPlaying(true);
      setIsEnded(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setIsEnded(true); // Set isEnded to true when audio finishes
  };

  return (
    <NodeViewWrapper>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: theme.palette.background.default,
          borderRadius: 20,
          width: 270,
          height: 60,
          paddingRight: 8,
          paddingLeft: 8,
          justifyContent: "space-around",
        }}
      >
        <IconButton
          size="small"
          onClick={isEnded ? handleReplay : handlePlayPause}
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          {isEnded ? <ReplayIcon /> : isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <AudioPlayer
          src={getAudioSource(node.attrs.src)}
          ref={player}
          style={{
            marginRight: "8px",
            width: "170px",
            borderRadius: 20,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
          showJumpControls={false}
          customAdditionalControls={[]}
          customVolumeControls={[]}
          defaultDuration={null}
          showFilledProgress={false}
          showDownloadProgress={false}
          layout="horizontal-reverse"
          customProgressBarSection={[RHAP_UI.PROGRESS_BAR, RHAP_UI.CURRENT_TIME]}
          onEnded={handleAudioEnd}
        />

        <IconButton
          size="small"
          aria-label="delete"
          sx={{ backgroundColor: theme.palette.background.paper }}
          onClick={handleDelete}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </NodeViewWrapper>
  );
};
