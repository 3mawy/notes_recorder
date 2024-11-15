import type React from "react";
import { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { themeColors } from "../../../../theme/schemes/LightTheme";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { useAppDispatch } from "../../../../store/hooks/storeHooks";
import { addRecording } from "../../audioSlice";
import blobToBase64 from "../../../../utils/fileUtils";

interface RecordedBlob {
  blob: Blob;
  blobURL: string;
  id: number;
}

interface AudioRecorderProps {
  // eslint-disable-next-line no-unused-vars
  onRecordingStop: (blob: RecordedBlob) => void;
}

const RecorderComponent: React.FC<AudioRecorderProps> = ({ onRecordingStop }) => {
  const [record, setRecord] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | undefined;

    if (record) {
      timerInterval = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [record]);

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const onStop = async (recordedBlob: { blob: Blob }) => {
    try {
      const audioBlob = new Blob([recordedBlob.blob], { type: "audio/wav" });
      const blobURL = URL.createObjectURL(audioBlob);

      // Convert blob to base64
      const base64Data = await blobToBase64(audioBlob);

      if (!base64Data) {
        throw new Error("Failed to convert blob to base64");
      }

      const recordingId = Date.now();
      const placeholderTag = `[TEMP_AUDIO_${recordingId}]`;

      dispatch(
        addRecording({
          id: recordingId,
          audioData: base64Data,
          name: placeholderTag,
          blobURL,
        }),
      );

      setRecordedBlob(true);
      onRecordingStop({ blobURL, blob: audioBlob, id: recordingId });
    } catch (error) {
      console.error("Error processing recording:", error);
    }
  };

  const handleRerecord = () => {
    setRecordedBlob(false);
    setDuration(0);
    setRecord(true);
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Grid
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        padding: 2,
        borderRadius: 2,
        maxWidth: 270,
        backgroundColor: theme.palette.background.default,
        height: 60,
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <ReactMic
          key={theme.palette.mode}
          record={record}
          className="sound-wave"
          visualSetting="frequencyBars"
          onStop={onStop}
          strokeColor={theme.palette.mode === "dark" ? "#ffffff" : "#000000"}
          backgroundColor={theme.palette.background.default}
        />
      </Box>
      {record && (
        <Box sx={{ marginLeft: 2, fontSize: "1rem", color: theme.palette.text.primary }}>
          {formatDuration(duration)}
        </Box>
      )}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {!record ? (
          recordedBlob ? (
            <IconButton
              color="error"
              onClick={handleRerecord}
              sx={{ backgroundColor: themeColors.light, height: "2rem", width: "2rem" }}
            >
              <ReplayIcon />
            </IconButton>
          ) : (
            <IconButton
              color="error"
              onClick={startRecording}
              sx={{ backgroundColor: themeColors.light, height: "2rem", width: "2rem" }}
            >
              <FiberManualRecordIcon />
            </IconButton>
          )
        ) : (
          <IconButton
            color="secondary"
            onClick={stopRecording}
            sx={{ backgroundColor: themeColors.light, height: "2rem", width: "2rem" }}
          >
            <StopIcon />
          </IconButton>
        )}
      </Box>
    </Grid>
  );
};

export default RecorderComponent;
