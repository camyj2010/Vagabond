import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useLanguageContext } from "../../../context/languageContext";

import { Box, Container, Typography, IconButton, SvgIcon } from "@mui/material";

import Header from "../../../components/Header";
import HeaderTrip from "../../../components/HeaderTrip";
import ButtonCard from "../../../components/ButtonCard";

import { getTrip } from "../../../utils/connections";

import { WaveFile } from "wavefile";
import { uploadAudio } from "../../../utils/connections";

// Icon for microphone and stop
const MicIcon = (props) => (
  <SvgIcon {...props} style={{ color: "white" }}>
    <path d="M12 1C10.34 1 9 2.34 9 4V10C9 11.66 10.34 13 12 13C13.66 13 15 11.66 15 10V4C15 2.34 13.66 1 12 1zM19 10C19 14.42 15.42 18 11 18C6.58 18 3 14.42 3 10H5C5 13.31 7.69 16 11 16C14.31 16 17 13.31 17 10H19zM12 19C12 19.55 11.55 20 11 20C10.45 20 10 19.55 10 19H8C8 20.66 9.34 22 11 22C12.66 22 14 20.66 14 19H12z"></path>
  </SvgIcon>
);

const StopIcon = (props) => (
  <SvgIcon {...props} style={{ color: "white" }}>
    <path d="M6 6H18V18H6z"></path>
  </SvgIcon>
);

export default function MyTrip() {
  let { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const auth = useAuth();

  const { t } = useLanguageContext();
  const texts = (data) => t(`myTrip.${data}`);

  useEffect(() => {
    const token = auth.user.accessToken;
    const fetchTrip = async () => {
      const trip = await getTrip(token, id);
      if (!trip) return;
      const tripInfo = trip.travel;
      const startDate = new Date(tripInfo.init_date);
      const endDate = new Date(tripInfo.finish_date);
      const stringInitDate = (tripInfo.init_date =
        startDate.toLocaleDateString("en-GB"));
      const stringFinishDate = (tripInfo.finish_date =
        endDate.toLocaleDateString("en-GB"));
      const formatedTrip = {
        ...tripInfo,
        init_date: stringInitDate,
        finish_date: stringFinishDate,
      };
      //console.log("tripInfo", formatedTrip);
      setTrip(formatedTrip);
    };
    fetchTrip();
  }, [auth,id]);

  

  const handleRecordButtonClick = async() => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
    } else {
      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunks.current = []; // Reset the array before starting

          mediaRecorder.start();
          setIsRecording(true);

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);
            // Convert the audio buffer to 16-bit PCM
            const pcmData = new Int16Array(audioBuffer.length);
            for (let i = 0; i < audioBuffer.length; i++) {
              pcmData[i] = audioBuffer.getChannelData(0)[i] * 0x7FFF; // Convert to 16-bit PCM
            }

            const wav = new WaveFile();
            wav.fromScratch(
              1, // Number of channels
              audioBuffer.sampleRate, // Sample rate
              '16', // Bit depth
              pcmData // PCM samples
            );

            const wavBlob = new Blob([wav.toBuffer()], { type: 'audio/wav' });

            // Convert Blob to File
            const wavFile = new File([wavBlob], 'recording.wav', { type: 'audio/wav' });
            try {
              const response = await uploadAudio(auth.user.accessToken, wavFile, 'es','en');
              setAudioUrl(response);
              console.log("Response:", response);
            } catch (error) {
              console.error("Error uploading audio", error);
            }
            // const wavUrl = URL.createObjectURL(wavBlob);
            // const link = document.createElement('a');
            // link.href = wavUrl;
            // link.download = 'recording.wav';
            // link.click();

            setIsRecording(false);
          };
        })
        .catch(error => console.error("Error accessing media devices.", error));
    }
  };

  return (
    <Container component="section" maxWidth="xs">
      <Header />
      <HeaderTrip
        mainPage={true}
        country={trip?.country ?? " "}
        country_cod={trip?.country_cod ?? " "}
        city={trip?.city ?? " "}
        init_date={trip?.init_date ?? " "}
        finish_date={trip?.finish_date ?? " "}
      />

      <Box mt={4} mb={4}>
        <ButtonCard
          imageLink="/Images/Checklist.jpeg"
          title={texts("mustButton")}
          clickLink="my_checklist"
          trip={trip}
        />

        <hr />

        <ButtonCard
          imageLink="/Images/Food1.jpeg"
          title={texts("foodButton")}
          clickLink="foodandmore"
          trip={trip}
        />

        <hr />

        <Typography variant="h5" textAlign="center" fontWeight="bold">
          {texts("interesting")}
        </Typography>
        <Box
          mt={2}
          sx={{
            width: "90%",
            padding: 2,
            marginInline: "auto",
            borderStyle: "solid",
            borderColor: "#e0e0e0",
            borderWidth: "1px",
            borderRadius: "10px",
            color: "#000",
          }}
        >
          {trip ? (
            trip.suggestions.map((suggestion, index) => {
              return (
                <div key={index} style={{ marginTop: "10px" }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ margin: "auto" }}
                  >
                    {suggestion.location}
                  </Typography>
                  <Typography variant="body2" sx={{ margin: "auto" }}>
                    {suggestion.description}
                  </Typography>
                </div>
              );
            })
          ) : (
            <p></p>
          )}
        </Box>
      </Box>
      {audioUrl && (
        <Box mt={4} mb={4} textAlign="center">
          <audio controls src={audioUrl}></audio>
        </Box>
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 18,
          zIndex: 1000,
        }}
      >
        <IconButton
          color="primary"
          onClick={handleRecordButtonClick}
          sx={{
            backgroundColor: isRecording ? "red" : "#2D6EFF",
            '&:hover': {
              backgroundColor: isRecording ? "darkred" : "primary.dark",
            },
            width: 56,
            height: 56,
            borderRadius: "50%",
          }}
        >
          {isRecording ? <StopIcon /> : <MicIcon />}
        </IconButton>
      </Box>
    </Container>
  );
}
