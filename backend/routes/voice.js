var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
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
const { GoogleGenerativeAI } = require("@google/generative-ai");


const API_KEY = process.env.api_key_gemmini;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const upload = multer({ dest: 'uploads/' });

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

router.post('/transcribe', upload.single('audio'), async (req, res, next) => {
    try {
        const filePath = req.file.path;
        const { languageAudio, languageObjetive } = req.body;

        if (!languageObjetive || !languageAudio) {
            return res.status(400).json({ error: 'Missing languageObjetive  or languageAudio in request body' });
        }

        // Obtener información del archivo WAV
        wavFileInfo.infoByFilename(filePath, async (err, info) => {
            if (err) {
                return next(err);
            }

            const sampleRateHertz = info.sample_rate;
            const audioBytes = fs.readFileSync(filePath).toString('base64');

            const audio = {
                content: audioBytes,
            };

            const config = {
                encoding: 'LINEAR16',
                sampleRateHertz: sampleRateHertz,
                languageCode: 'en-US',
                alternativeLanguageCodes: ['en-US', 'es-ES', languageAudio],
            };

            const request = {
                audio: audio,
                config: config,
            };

            const [response] = await client.recognize(request);
            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');

            // Elimina el archivo temporal
            fs.unlinkSync(filePath);

            // Traducción a inglés utilizando la función de traducción
            const translatedText = await translateText(transcription, languageAudio, languageObjetive);

            // Convertir el texto traducido a habla
            const audioContent = await ToSpeech(translatedText, languageObjetive);

            // Guardar el contenido de audio en un archivo temporal
            const outputFilePath = 'output.mp3';
            fs.writeFileSync(outputFilePath, audioContent, 'base64');

            // Enviar el archivo de audio como respuesta
            res.setHeader('Content-Type', mime.lookup(outputFilePath));
            res.setHeader('Content-Disposition', 'attachment; filename=output.mp3');
            fs.createReadStream(outputFilePath).pipe(res).on('finish', () => {
                // Eliminar el archivo temporal después de enviarlo
                fs.unlinkSync(outputFilePath);
            });
        });

    } catch (error) {
        next(error);
    }
});

async function translateText(text, sourceLang, targetLang) {
    try {
        const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: ${text}`;

        const result = await model.generateContent(prompt);
        const responseGemini = await result.response;
        const translateGemini = responseGemini.text();
        console.log(translateGemini)
        return translateGemini;
    } catch (error) {
        console.error('Error translating text:', error);
        throw new Error('Translation failed');
    }
}

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