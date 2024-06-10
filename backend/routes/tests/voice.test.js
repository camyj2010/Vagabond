const request = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const admin = require('../../firebaseConfig');
const path = require('path');
const fs = require('fs');
const app = require('../../app');
const mime = require('mime-types');
const {ModelUser,ModelTravel,ModelChecklist} = require('../../userModel');
const middleware = require('../../middleware');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const API_KEY = process.env.api_key_gemmini;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

describe('POST /api/voice/transcribe', () => {
    let recognizeStub, toSpeechStub,verifyIdTokenStub, generateContentStub ;

    beforeAll(() => {
        verifyIdTokenStub = sinon.stub(admin.auth(), 'verifyIdToken').resolves({ uid: 'test-uid' });
    });
    

    beforeEach(() => {
        recognizeStub = sinon.stub(speech.SpeechClient.prototype, 'recognize').resolves([{ results: [{ alternatives: [{ transcript: 'Hola mundo' }] }] }]);
        generateContentStub = sinon.stub(model, 'generateContent').resolves({ response: { text: () => 'Hello world' } });
        toSpeechStub = sinon.stub(textToSpeech.TextToSpeechClient.prototype, 'synthesizeSpeech').resolves([{ audioContent: 'audio_content_base64' }]);
    });

    afterEach(() => {
        recognizeStub.restore();
        toSpeechStub.restore();
        generateContentStub.restore();
    });

    afterAll(() => {
        verifyIdTokenStub.restore();
         
        const filesInRoot = fs.readdirSync('./').filter(file => file.startsWith('output_'));
        filesInRoot.forEach(file => fs.unlinkSync(file));

       
        const filesInUploads = fs.readdirSync('./uploads').filter(file => /^[a-f0-9]{32}$/.test(file));
        filesInUploads.forEach(file => fs.unlinkSync(`./uploads/${file}`));
    })

    it('should return 200 and transcribe, translate, and convert audio to speech', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        const wavFilePath = path.join(__dirname, './test.wav');
        const response = await request(app)
            .post('/api/voice/transcribe')
            .set('Authorization', `Bearer ${token}`)
            .attach('audio', wavFilePath)
            .field('languageAudio', 'es')
            .field('languageObjetive', 'en');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('text');
        expect(response.body).toHaveProperty('audioUrl');
    });

    it('should return 400 if no audio file is uploaded', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        const response = await request(app)
            .post('/api/voice/transcribe')
            .set('Authorization', `Bearer ${token}`)
            .field('languageAudio', 'es')
            .field('languageObjetive', 'en');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'No se ha subido ningún archivo de audio' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        recognizeStub.rejects(new Error('API error'));

        const response = await request(app)
            .post('/api/voice/transcribe')
            .set('Authorization', `Bearer ${token}`)
            .attach('audio', Buffer.from('fake_audio_data'), 'test.wav')
            .field('languageAudio', 'es')
            .field('languageObjetive', 'en');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: {} });
    });
});

describe('POST /api/voice/read', () => {
    let decodeTokenStub, generateContentStub, toSpeechStub,verifyIdToken;

    beforeAll(() => {
        verifyIdTokenStub = sinon.stub(admin.auth(), 'verifyIdToken').resolves({ uid: 'test-uid' });
    });

    beforeEach(() => {
        decodeTokenStub = sinon.stub(middleware, 'decodeToken').callsFake((req, res, next) => next());
        generateContentStub = sinon.stub(model, 'generateContent').resolves({ response: { text: () => 'Hello world' } });
        toSpeechStub = sinon.stub(textToSpeech.TextToSpeechClient.prototype, 'synthesizeSpeech').resolves([{ audioContent: 'audio_content_base64' }]);
    });

    afterEach(() => {
        decodeTokenStub.restore();
        generateContentStub.restore();
        toSpeechStub.restore();
    });

    afterAll(() => {
        verifyIdTokenStub.restore();

        const filesInRoot = fs.readdirSync('./').filter(file => file.startsWith('output_'));
        filesInRoot.forEach(file => fs.unlinkSync(file));


        const filesInUploads = fs.readdirSync('./uploads').filter(file => /^[a-f0-9]{32}$/.test(file));
        filesInUploads.forEach(file => fs.unlinkSync(`./uploads/${file}`));
    })

    it('should return 200 and translate text and convert it to speech', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        const response = await request(app)
            .post('/api/voice/read')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Hola mundo', languageText: 'es', languageObjective: 'en' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('text');
        expect(response.body).toHaveProperty('audioUrl');
    });

    it('should return 400 if required fields are missing', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        const response = await request(app)
            .post('/api/voice/read')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Hola mundo', languageText: 'es' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing text, languageText, or languageObjective in request body' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        toSpeechStub.rejects(new Error('API error'));

        const response = await request(app)
            .post('/api/voice/read')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Hola mundo', languageText: 'es', languageObjective: 'en' });

        expect(response.status).toBe(500);
        expect(response.body.message).toEqual("API error");
    });
});

describe('GET /api/:filename', () => {
    // it('should return 200 and the audio file', async () => {
    //     const filename = 'output_test.mp3';
    //     fs.writeFileSync(filename, 'audio_content_base64', 'base64');

    //     const response = await request(app)
    //         .get(`/api/voice/${filename}`);

    //     expect(response.status).toBe(200);
    //     expect(response.headers['content-type']).toBe(mime.lookup(filename));
    //     expect(response.headers['content-disposition']).toContain(`filename=${filename}`);

    //     // Limpiar el archivo después de la prueba
    //     fs.unlinkSync(filename);
    // },30000);

    it('should return 404 if the file does not exist', async () => {
        try {
           
            const response = await request(app).get('/api/non_existent_file.mp3');
            
            expect(response.status).toBe(404);
        } catch (error) {
            
            expect(error.code).toBe('ENOENT');
        }
    });
});