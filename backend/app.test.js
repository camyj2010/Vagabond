const request = require('supertest');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const admin = require('./firebaseConfig');
const app = require('./app');
const {ModelUser,ModelTravel,ModelChecklist} = require('./userModel');
const middleware = require('./middleware');
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

// CREATE TRAVEL TEST
describe('POST /api/travel', () => {
    let mongoServer;
    let decodeTokenStub;
    let findUserStub;
    let createTravelStub;
    let genAIStub;
    let verifyIdTokenStub;
    const testTravel = {
        firebase_id: 'test_firebase_id',
        country: 'Test Country',
        country_cod: 'TC',
        city: 'Test City',
        description: 'Test Description',
        init_date: '2023-01-01',
        finish_date: '2023-01-10'
    };

    const testUser = {
        _id: new mongoose.Types.ObjectId(),
        firebase_id: 'test_firebase_id'
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
        verifyIdTokenStub = sinon.stub(admin.auth(), 'verifyIdToken').resolves({ uid: 'test_firebase_id' });
        decodeTokenStub = sinon.stub(middleware, 'decodeToken').callsFake((req, res, next) => {
            req.user = { uid: 'test_firebase_id' };
            next();
        });
        findUserStub = sinon.stub(ModelUser, 'findOne');
        createTravelStub = sinon.stub(ModelTravel, 'create');
        genAIStub = sinon.stub(GoogleGenerativeAI.prototype, 'getGenerativeModel').returns({
            generateContent: sinon.stub().resolves({
                response: {
                    text: () => JSON.stringify({ suggestions: [] })
                }
            })
        });
    });

    afterEach(() => {
        verifyIdTokenStub.restore();
        decodeTokenStub.restore();
        findUserStub.restore();
        createTravelStub.restore();
        genAIStub.restore();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/travel')
            .set('Authorization', 'Bearer test_token')  // Agrega el encabezado Authorization
            .send({ country: 'Test Country', country_cod: 'TC' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "All fields are required" });
    });

    it('should return 404 if user is not found', async () => {
        findUserStub.returns({ exec: sinon.stub().resolves(null) });

        const response = await request(app)
            .post('/api/travel')
            .set('Authorization', 'Bearer test_token')  // Agrega el encabezado Authorization
            .send(testTravel);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Usuario no encontrado" });
    });

    it('should return 201 and create a travel if data is valid', async () => {
        findUserStub.returns({ exec: sinon.stub().resolves(testUser) });
        createTravelStub.resolves(testTravel);

        const response = await request(app)
            .post('/api/travel')
            .set('Authorization', 'Bearer test_token')  // Agrega el encabezado Authorization
            .send(testTravel);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Trip successfully created", travel: testTravel });
    });

    it('should return 500 if there is a server error', async () => {
        findUserStub.returns({ exec: sinon.stub().resolves(testUser) });
        createTravelStub.rejects(new Error('Database error'));

        const response = await request(app)
            .post('/api/travel')
            .set('Authorization', 'Bearer test_token')  // Agrega el encabezado Authorization
            .send(testTravel);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error Travel Creation" });
    });
});