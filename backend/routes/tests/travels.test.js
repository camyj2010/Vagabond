const request = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const admin = require('../../firebaseConfig');
const app = require('../../app');
const {ModelUser,ModelTravel,ModelChecklist} = require('../../userModel');
const middleware = require('../../middleware');
const { GoogleGenerativeAI } = require("@google/generative-ai");


describe('Travel API GET /:firebase_id', () => {
    let mongoServer;
    let verifyIdTokenStub;
    let generateContentStub;
    let userId
    let travelId

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
    
        await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

        const user = new ModelUser({
            username: 'test_user' ,
            email: 'testmail@example.com',
            firebase_id: 'test_firebase_id',
        });
        await user.save();
        userId = user._id
        const travel1 = new ModelTravel({
            _user_id: userId,
            country: 'Test Country1',
            country_cod: 'TC1',
            city: 'Test City1',
            description: 'Test Description1',
            init_date: '2024-07-01T00:00:00Z',
            finish_date: '2024-12-07T00:00:00Z',
        });
        await travel1.save();
        const travel2 = new ModelTravel({
            _user_id: userId,
            country: 'Test Country2',
            country_cod: 'TC2',
            city: 'Test City2',
            description: 'Test Description2',
            init_date: '2025-03-01T00:00:00Z',
            finish_date: '2025-06-07T00:00:00Z',
        });
        await travel2.save();
        

        verifyIdTokenStub = sinon.stub(admin.auth(), 'verifyIdToken').resolves({ uid: 'test-uid' });
    });
    
    afterAll(async () => {
        // Restaurar stubs y limpiar la base de datos después de cada prueba
        sinon.restore();
        verifyIdTokenStub.restore();
        await ModelUser.deleteMany({});
        await ModelTravel.deleteMany({});
        // Cerrar la conexión de mongoose y el servidor en memoria después de todas las pruebas
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should return 200 and the travels for the user', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });

        const response = await request(app)
            .get('/api/travels/test_firebase_id')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Travels successfully retrieved");
        expect(response.body.travels.length).toBe(2);
        expect(response.body.currentTravel).toBe(null); // O ajusta según la fecha actual
    });

    it('should return 404 if the user is not found', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });

        const response = await request(app)
            .get('/api/travels/non-existent-firebase-id')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });
});