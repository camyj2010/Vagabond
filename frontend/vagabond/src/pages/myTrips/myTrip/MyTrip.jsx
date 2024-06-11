import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useLanguageContext } from "../../../context/languageContext";

import {
  Box,
  Container,
  Typography,
  //IconButton,
  SvgIcon,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";

import Header from "../../../components/Header";
import HeaderTrip from "../../../components/HeaderTrip";
import ButtonCard from "../../../components/ButtonCard";

import { getAudio, getTrip, traslateText, uploadAudio } from "../../../utils/connections";
import languages from "../../../utils/languages";

//import { WaveFile } from "wavefile";
import { LoadingButton } from "@mui/lab";
//import { MediaCapture } from "@ionic-native/media-capture";
//import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
//import { Microphone } from "@mozartec/capacitor-microphone";
//import { set } from "firebase/database";

// Icon for microphone and stop
// const MicIcon = (props) => (
//   <SvgIcon {...props} style={{ color: "white" }}>
//     <path d="M12 1C10.34 1 9 2.34 9 4V10C9 11.66 10.34 13 12 13C13.66 13 15 11.66 15 10V4C15 2.34 13.66 1 12 1zM19 10C19 14.42 15.42 18 11 18C6.58 18 3 14.42 3 10H5C5 13.31 7.69 16 11 16C14.31 16 17 13.31 17 10H19zM12 19C12 19.55 11.55 20 11 20C10.45 20 10 19.55 10 19H8C8 20.66 9.34 22 11 22C12.66 22 14 20.66 14 19H12z"></path>
//   </SvgIcon>
// );

// const StopIcon = (props) => (
//   <SvgIcon {...props} style={{ color: "white" }}>
//     <path d="M6 6H18V18H6z"></path>
//   </SvgIcon>
// );

export default function MyTrip() {
  let { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [languageAudio, setLanguageAudio] = useState("");
  const [languageObjective, setLanguageObjective] = useState("");
  const [responseText, setResponseText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [text, setText] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

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
  }, [auth, id]);

  // const handleRecordButtonClick = async () => {
  //   console.log("Esta mamada funciona porque funciona porque ya estoy mamado de esta aplicacion de catremonda")
		
  //   if (!languageAudio || !languageObjective) {
  //     setErrorMessage(texts("error"));
  //     return;
  //   }
  //   setErrorMessage("");
  //   setIsRecording(true);

  //   try {
			
	// 		const permision = await Filesystem.requestPermissions;
	// 		console.log("Permision nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn:", permision); 
  //     const mediaFiles = await MediaCapture.captureAudio();
  //     setIsRecording(false)
  //     if(mediaFiles.length > 0){
  //       const audioFile = mediaFiles[0];
	// 			console.log("Soy el audio file y espero que pueda leer lo que sale de aca: \n",audioFile)
  //       // Leer el archivo de audio con Capacitor Filesystem
  //       const audioFilePath = audioFile.fullPath.replace("file:/storage/emulated/0/Recordings", "");
  //       const audioData = await Filesystem.readFile({
  //         path: audioFile.fullPath,
  //         //directory: Directory.Recordings,
  //       });

  //       const audioBlob = new Blob([new Uint8Array(audioData.data)], { type: 'audio/mpeg' });
  //       const arrayBuffer = await audioBlob.arrayBuffer();
  //       const audioBuffer = await new AudioContext().decodeAudioData(
  //         arrayBuffer
  //       );
  //       console.log("Vamos a convertir esto a wav")
    
  //       // Convert the audio buffer to 16-bit PCM
  //       const pcmData = new Int16Array(audioBuffer.length);
  //       for (let i = 0; i < audioBuffer.length; i++) {
  //         pcmData[i] = audioBuffer.getChannelData(0)[i] * 0x7fff; // Convert to 16-bit PCM
  //       }
    
  //       const wav = new WaveFile();
  //       wav.fromScratch(
  //         1, // Number of channels
  //         audioBuffer.sampleRate, // Sample rate
  //         "16", // Bit depth
  //         pcmData // PCM samples
  //       );
    
  //       const wavBlob = new Blob([wav.toBuffer()], { type: "audio/wav" });
    
  //       // Convert Blob to File
  //       const wavFile = new File([wavBlob], "recording.wav", {
  //         type: "audio/wav",
  //       });
  //       console.log("Pude convertir esto a wav")
  //       try {
  //         const response = await uploadAudio(
  //           auth.user.accessToken,
  //           wavFile,
  //           languageAudio,
  //           languageObjective
  //         );
  //         const audioBlob = new Blob([response.audio], {
  //           type: "audio/mpeg",
  //         });
  //         const audioUrl = URL.createObjectURL(audioBlob);
  //         // Reproducir el audio automáticamente
  //         const audio = new Audio(audioUrl);
  //         audio.play();
  //         setResponseText(response.text);
  //         console.log("Response:", response);
  //       } catch (error) {
  //         console.error("Error uploading audio", error);
  //       }
  //     }

  //   } catch (error) {
  //     console.error("Error uploading audio", error);
  //     setErrorMessage(texts("uploadingError"));
  //     setIsRecording(false)
  //   }
  // };

	// const hadleSecondStartRecording = async () => {
  //   if (!languageAudio || !languageObjective) {
  //     setErrorMessage(texts("error"));
  //     return;
  //   }
  //   try {
	// 		const requestPermissionsResult = await Microphone.requestPermissions();
	// 		console.log("Request permissions result: " + JSON.stringify(requestPermissionsResult));
	// 		const startRecordingResult = await Microphone.startRecording();
	// 		console.log("Start recording result: " + JSON.stringify(startRecordingResult));
	// 		setIsRecording(true);
	// 	} catch (error) {
	// 		console.error("Error starting recording", error);
	// 	}
	// }

	// const handleSecondStopRecording = async () => {
	// 	try {
	// 		const stopRecordingResult = await Microphone.stopRecording();
	// 		console.log("Stop recording result webpath or something duration: " + JSON.stringify(stopRecordingResult.base64String));
			
	// 		setIsRecording(false);
      //const baseString = stopRecordingResult.base64String;
      // const binaryString = window.atob(baseString);
      // const len = binaryString.length;
      // const bytes = new Uint8Array(len);
      // for (let i = 0; i < len; i++) {
      //   bytes[i] = binaryString.charCodeAt(i);
      // }
      // const response = await fetch(stopRecordingResult.webPath);
			//console.log("Response de la fetch del archivo: " + JSON.stringify(response))
			//console.log("Response de la fetch del archivo sin el JSOn pero con string: ", String(response))
			//console.log("Response de la fetch del archivo sin el JSOn y sin nada: " + response)			
      //const blob = await response.blob();
      //console.log("Soy el blob de la response despues de hacer le fetch del archivo: " + JSON.stringify(blob))
      // const arrayBuffer = bytes.buffer;
      // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      // // Convert the audio buffer to 16-bit PCM
      // const pcmData = new Int16Array(audioBuffer.length);
      // for (let i = 0; i < audioBuffer.length; i++) {
      //   pcmData[i] = audioBuffer.getChannelData(0)[i] * 0x7fff; // Convert to 16-bit PCM
      // }
  
      // const wav = new WaveFile();
      // wav.fromScratch(
      //   1, // Number of channels
      //   audioBuffer.sampleRate, // Sample rate
      //   "16", // Bit depth
      //   pcmData // PCM samples
      // );
      // const wavBlob = new Blob([wav.toBuffer()], { type: "audio/wav" });
    
      // Convert Blob to File
      // const wavFile = new File([wavBlob], "recording.wav", {
      //   type: "audio/wav",
      // });
  //     console.log("Pude convertir esto a wav")
	// 		const audioData = stopRecordingResult.base64String;
  //     try {
  //       const response = await uploadAudio(
  //         auth.user.accessToken,
  //         audioData,
  //         languageAudio,
  //         languageObjective
  //       );
	// 			console.log("Response:", JSON.stringify(response))
	// 			console.log("Response sin JSON:", response)

  //       const audioBlob = new Blob([response.audio], {
  //         type: "audio/mpeg",
  //       });
  //       const audioUrl = URL.createObjectURL(audioBlob);
  //       // Reproducir el audio automáticamente
  //       const audio = new Audio(audioUrl);
  //       audio.play();
  //       setResponseText(response.text);
  //       console.log("Response:", response);
  //     } catch (error) {
  //       console.error("Error uploading audio", error);
  //     }
	// 	} catch (error) {
	// 		console.error("Error stopping recording", error);
	// 	}
	// }


  const handleTextTranslate = async () => {
    setLoadingButton(true);
    try {
      const data = {
        text: text,
        languageText: languageAudio,
        languageObjective: languageObjective,
      };
      const response = await traslateText(auth.user.accessToken, data);
      console.log("Response:", response);
			console.log("Audio URL:", response.audioUrl)
			const audioResponse = await getAudio(auth.user.accessToken, response.audioUrl);
			console.log("Audio response:", audioResponse)
			const audioBlob = new Blob([audioResponse], {
        type: "audio/mpeg",
      });
      const audioUrl = URL.createObjectURL(audioBlob);	
      // Reproducir el audio automáticamente
      const audio = new Audio(audioUrl);
      audio.play();
      setResponseText(response.text);
      setLoadingButton(false);
    } catch (error) {
      console.error("Error traslating the text", error);
      setLoadingButton(false);
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

        <hr />

        <Typography variant="h5" textAlign="center" fontWeight="bold">
          {texts("translate")}
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="language-audio-label">{texts("from")}</InputLabel>
          <Select
            labelId="language-audio-label"
            value={languageAudio}
            label="Language Audio"
            onChange={(e) => setLanguageAudio(e.target.value)}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="language-objective-label">{texts("to")}</InputLabel>
          <Select
            labelId="language-objective-label"
            value={languageObjective}
            label="Language Objective"
            onChange={(e) => setLanguageObjective(e.target.value)}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          <Typography variant="body1" sx={{ margin: "auto" }}>
            {responseText}
          </Typography>
        </Box>
        <TextField
          label={texts("text")}
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{
            fontFamily: "Inter",
            fontWeight: 400,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#2D6EFF",
              },
            },
            "& input": {
              fontFamily: "Inter",
            },
          }}
        />
        <LoadingButton
          loading={loadingButton}
          variant="contained"
          size="large"
          sx={{ width: "100%", mt: 1 }}
          onClick={() => handleTextTranslate()}
        >
          Traducir
        </LoadingButton>
      </Box>
      {errorMessage && (
        <Typography variant="body2" color="error" sx={{ margin: "10px auto" }}>
          {errorMessage}
        </Typography>
      )}
      {/* <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 18,
          zIndex: 1000,
        }}
      >
        <IconButton
          color="primary"
          onClick={isRecording ? handleSecondStopRecording : hadleSecondStartRecording}
          sx={{
            backgroundColor: isRecording ? "red" : "#2D6EFF",
            "&:hover": {
              backgroundColor: isRecording ? "darkred" : "primary.dark",
            },
            width: 56,
            height: 56,
            borderRadius: "50%",
          }}
        >
          {isRecording ? <StopIcon /> : <MicIcon />}
        </IconButton>
      </Box> */}
    </Container>
  );
}
