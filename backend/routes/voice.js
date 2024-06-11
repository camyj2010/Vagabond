var express = require('express');
var bodyParser = require('body-parser');
// var multer = require('multer');
var router = express.Router();
router.use(bodyParser.json());
const middleware = require('../middleware');
const fs = require('fs');
require('dotenv').config();
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const wavFileInfo = require('wav-file-info');
const axios = require('axios');
const mime = require('mime-types');
const translate = require('translate-google-api');
// const { GoogleGenerativeAI } = require("@google/generative-ai");
const FormData = require('form-data');

const multer = require('multer');
const upload = multer();

// const API_KEY = process.env.api_key_gemmini;
// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// const upload = multer({ dest: 'uploads/' });

const client = new speech.SpeechClient({
    credentials: {
        type: process.env.GOOGLE_CLOUD_TYPE,
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
        private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
        auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
        token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
    },
});
const ttsClient = new textToSpeech.TextToSpeechClient({
    credentials: {
        type: process.env.GOOGLE_CLOUD_TYPE,
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
        private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
        auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
        token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
    },
});

// Endpoint for transcribing audio, translating the transcription, and converting it to speech
router.post('/transcribe', upload.none(), async (req, res, next) => {
    try {
        const { audio, languageAudio, languageObjetive } = req.body;

        if (!audio) {
            return res.status(400).json({ error: 'No se ha proporcionado ningún archivo de audio en base64' });
        }

        if (!languageObjetive || !languageAudio) {
            return res.status(400).json({ error: 'Faltan languageObjetive o languageAudio en el cuerpo de la solicitud' });
        }
        console.log("audio________________________________________________",audio);

        // Decodificar el archivo base64
        const buffer = Buffer.from(audio, 'base64');

        // Configurar la solicitud para la API de Google Cloud Speech-to-Text
        const audioContent = buffer.toString('base64');
        const request = {
            audio: {
                content: audioContent,
            },
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000, // Asegúrate de que esta tasa de muestreo sea correcta para tu audio
                languageCode: languageAudio,
                alternativeLanguageCodes: ['en-US', 'es-ES'], // Añade más códigos de idiomas si es necesario
            },
        };

        // Enviar la solicitud de reconocimiento de voz
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log("trasncription______________________________ ", transcription)
        // Traducción del texto transcrito
        const translatedText = await translateText(transcription, languageAudio, languageObjetive);

        // Convertir el texto traducido a habla
        const audioContentTranslated = await ToSpeech(translatedText, languageObjetive);

        // Guardar el contenido de audio traducido en un archivo temporal
        const outputFilePath = `output_${Date.now()}.mp3`;
        fs.writeFileSync(outputFilePath, audioContentTranslated, 'base64');

        // Enviar la respuesta JSON incluyendo un enlace al archivo de audio
        res.status(200).json({
            message: "Voz transcrita",
            text: translatedText,
            audioUrl: `${outputFilePath}`
        });

    } catch (error) {
        next(error);
    }
});
// Endpoint for reading a text, translating it, and converting it to speech
router.post('/read', middleware.decodeToken, async (req, res, next) => {
    try {
        const { text, languageText, languageObjective } = req.body;

        if (!text || !languageText || !languageObjective) {
            return res.status(400).json({ error: 'Missing text, languageText, or languageObjective in request body' });
        }

        // Traducción del texto
        const translatedText = await translateText(text, languageText, languageObjective);

        // Convertir el texto traducido a habla
        const audioContent = await ToSpeech(translatedText, languageObjective);

        // Guardar el contenido de audio en un archivo temporal
        const outputFilePath = `output_${Date.now()}.mp3`;
        fs.writeFileSync(outputFilePath, audioContent, 'base64');

        // Enviar la respuesta JSON incluyendo un enlace al archivo de audio
        res.status(200).json({
            message: "transcribed voice",
            text: translatedText,
            audioUrl: `${outputFilePath}`
        });

} catch (error) {
    next(error);
}
});


// Ruta para descargar el archivo de audio
router.get('/:filename', (req, res, next) => {
    const filename = req.params.filename;
    const filePath = `./${filename}`;

    res.setHeader('Content-Type', mime.lookup(filePath));
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    fs.createReadStream(filePath).pipe(res).on('finish', () => {
        // Eliminar el archivo temporal después de enviarlo
        fs.unlinkSync(filePath);
    });
});


// Function to translate text using Google Generative AI
// async function translateText(text, sourceLang, targetLang) {
//     try {
//         const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: ${text}`;

//         const result = await model.generateContent(prompt);
//         const responseGemini = await result.response;
//          // Verificar si el contenido es inseguro
//         if (responseGemini.unsafety) {
//             return { error: 'unsafe content' };
//         }
//         const translateGemini = responseGemini.text();
//         console.log(translateGemini)
//         return translateGemini;
//     } catch (error) {
//         console.error('Error translating text:', error);
//         throw new Error('Translation failed');
//     }
// }
async function translateText(text, sourceLang, targetLang) {
    try {
        const result = await translate(text, { from: sourceLang, to: targetLang });
        const translation = result[0];
        console.log(`Translation: ${translation}`);
        return translation;
    } catch (error) {
        console.error('Error translating text:', error);
        throw new Error('Translation failed');
    }
}

// Function to convert text to speech using Google Cloud Text-to-Speech
async function ToSpeech(text, language) {
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: language, ssmlGender: 'NEUTRAL' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    return response.audioContent;
}

module.exports = router;