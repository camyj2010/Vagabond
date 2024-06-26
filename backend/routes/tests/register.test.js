const request = require('supertest');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const admin = require('../../firebaseConfig');
const app = require('../../app');
const {ModelUser,ModelTravel,ModelChecklist} = require('../../userModel');
const middleware = require('../../middleware');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// REGISTER TEST
describe('POST /api/register', () => {
    let createStub;
    let mongoServer;
    const testUser = {
        username: 'testuser',
        email: 'testuser@example.com'
    };

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    beforeEach(() => {
        createStub = sinon.stub(ModelUser, 'create');
    });


    afterEach(() => {
        createStub.restore();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should return 400 if username or email is missing', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ username: '' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "All fields are required" });
    });

    it('should return 201 and create a user if data is valid', async () => {
        createStub.resolves(testUser);

        const response = await request(app)
            .post('/api/register')
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Usuario creado con éxito.", user: testUser });
    });

    it('should return 500 if there is a server error', async () => {
        createStub.rejects(new Error('Database error'));

        const response = await request(app)
            .post('/api/register')
            .send(testUser);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error al registrar nuevo usuario." });
    });
});
