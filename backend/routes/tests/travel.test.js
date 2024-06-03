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


// TRAVEL TEST
describe ('api/travel', () => {

    let mongoServer;
    let verifyIdTokenStub;
    let generateContentStub;
    let userId
    let travelId
    const badtestTravel = {
        firebase_id: 'fail',
        country: 'Test Country',
        country_cod: 'TC',
        city: 'Test City',
        description: 'Test Description',
        init_date: '2023-01-01',
        finish_date: '2023-01-10'
    };    

    const testTravel = {
        firebase_id: 'test_firebase_id',
        country: 'Test Country',
        country_cod: 'TC',
        city: 'Test City',
        description: 'Test Description',
        init_date: '2024-07-01T00:00:00Z',
        finish_date: '2024-07-07T00:00:00Z',
    };  

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
        

        verifyIdTokenStub = sinon.stub(admin.auth(), 'verifyIdToken').resolves({ uid: 'test-uid' });
         // Mock del método getGenerativeModel y generateContent de GEMINI
            generateContentStub = sinon.stub(GoogleGenerativeAI.prototype, 'getGenerativeModel').returns({
                generateContent: sinon.stub().resolves({
                response: {
                    text: () => JSON.stringify([
                    { location: 'Location 1', description: 'Description 1' },
                    { location: 'Location 2', description: 'Description 2' },
                    { location: 'Location 3', description: 'Description 3' },
                    { location: 'Location 4', description: 'Description 4' },
                    { location: 'Location 5', description: 'Description 5' }
                    ])
                }
                })
            });
    });
    
    // beforeEach(async () => {
       
    // });
    
    // afterEach(async () => {
        
    // });
    
    afterAll(async () => {
        // Restaurar stubs y limpiar la base de datos después de cada prueba
        sinon.restore();
        verifyIdTokenStub.restore();
        generateContentStub.restore();
        await ModelUser.deleteMany({});
        await ModelTravel.deleteMany({});
        await ModelChecklist.deleteMany({})
        // Cerrar la conexión de mongoose y el servidor en memoria después de todas las pruebas
        await mongoose.disconnect();
        await mongoServer.stop();
    });
    // CREATE TRAVEL TEST
describe('POST /api/travel', () => {
    const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/travel')
            .send({ country: 'Test Country', country_cod: 'TC' })
            .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "All fields are required" });
    });

    it('should return 404 if user is not found', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        const response = await request(app)
            .post('/api/travel')
            .send(badtestTravel)
            .set('Authorization', `Bearer ${token}`);  // Agrega el encabezado Authorization

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Usuario no encontrado" });
    });

    it('should return 201 and create a travel if data is valid', async () => {
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });

        const response = await request(app)
            .post('/api/travel') 
            .send(testTravel)
            .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
        jest.setTimeout(15000);
        expect(response.body.message).toBe("Trip successfully created")
        travelId = response.body.travel._id
        expect(response.status).toBe(201);
    },30000);

    it('should return 500 if there is a server error', async () => {
        const createStub =  sinon.stub(ModelTravel, 'create').rejects(new Error('Database error'));
        const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        const response = await request(app)
            .post('/api/travel')
            .send(testTravel)
            .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
        jest.setTimeout(15000);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error Travel Creation" });
        createStub.restore(); // Restaurar el stub después de la prueba
    },30000);
});


    //BRING TRAVEL TEST
    describe('GET api/travel/:_id', () => {
       
        it('should retrieve the travel information', async () => {
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });

            const response = await request(app)
            .get(`/api/travel/${travelId}`)
            .set('Authorization', `Bearer ${token}`);
        
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Travel successfully retrieved');
            expect(response.body).toHaveProperty('travel');
            expect(response.body.travel).toHaveProperty('_id', String(travelId));
        });
        
        it('should return 500 if there is an error', async () => {
            // Simular un error en el método find del modelo
            const findStub = sinon.stub(ModelTravel, 'find').throws(new Error('Test error'));

            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        
            const response = await request(app)
            .get('/api/travel/invalid_id')
            .set('Authorization', `Bearer ${token}`);
        
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Error retrieving travel');
        
            // Restaurar el stub después de la prueba
            findStub.restore();
        });
    });
    //UPDATE TRAVEL TEST
    describe('PATCH api/travel/:_id', () => {
        it('should update the travel information and generate new suggestions', async () => {
            // Generar un token JWT de prueba
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        
            const updateData = {
              country: 'Updated Country',
              city: 'Updated City',
              description: 'Updated Description'
            };
        
            const response = await request(app)
              .patch(`/api/travel/${travelId}`)
              .set('Authorization', `Bearer ${token}`)
              .send(updateData);
            jest.setTimeout(15000);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Travel Updated');
            expect(response.body).toHaveProperty('travel');
            expect(response.body.travel).toHaveProperty('_id', String(travelId));
            expect(response.body.travel).toHaveProperty('country', 'Updated Country');
            expect(response.body.travel).toHaveProperty('city', 'Updated City');
            expect(response.body.travel).toHaveProperty('description', 'Updated Description');
            expect(response.body.travel).toHaveProperty('suggestions');
            expect(response.body.travel.suggestions).toHaveLength(5);
            response.body.travel.suggestions.forEach(suggestion => {
              expect(suggestion).toHaveProperty('location');
              expect(suggestion).toHaveProperty('description');
            });
          },30000);
        
          it('should return 400 if no fields are provided for update', async () => {
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        
            const response = await request(app)
              .patch(`/api/travel/${travelId}`)
              .set('Authorization', `Bearer ${token}`)
              .send({});
        
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'At least one variable must be changed');
          });
        
        //   it('should return 404 if the travel is not found', async () => {
        //     const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        //     const nonExistentId = new mongoose.Types.ObjectId();
        
        //     const response = await request(app)
        //       .patch(`/api/travel/${nonExistentId}`)
        //       .set('Authorization', `Bearer ${token}`)
        //       .send({ country: 'Non-existent Country' });
        
        //     expect(response.status).toBe(404);
        //     expect(response.body).toHaveProperty('message', 'Travel not found');
        //   });
        
          it('should return 500 if there is an internal server error', async () => {
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        
            // Simular un error en el método save del modelo
            const saveStub = sinon.stub(ModelTravel.prototype, 'save').throws(new Error('Test error'));
        
            const response = await request(app)
              .patch(`/api/travel/${travelId}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ country: 'Cause Error' });
        
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Error Travel Update');
        
            // Restaurar el stub después de la prueba
            saveStub.restore();
          },15000);
    });

    describe('GET /api/travel/food/:_id', () => {
        it('should return restaurant recommendations for a specific travel', async () => {


            // Crear un token JWT de prueba
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
            
    
            // Realizar una solicitud GET al endpoint con el ID del viaje de prueba y el token JWT
            const response = await request(app)
                .get(`/api/travel/food/${travelId}`)
                .set('Authorization', `Bearer ${token}`);
    
            // Verificar que la respuesta tenga un código de estado 200 y contenga las recomendaciones de restaurantes
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Travel successfully retrieved');
    
        });
    
        // it('should return 404 if the travel is not found', async () => {
        //     // Crear un token JWT de prueba
        //     const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        //     const badId= "anybadID"
        //     // Realizar una solicitud GET al endpoint con un ID de viaje inexistente y el token JWT
        //     const response = await request(app)
        //         .get(`/api/travel/food/${badId}`)
        //         .set('Authorization', `Bearer ${token}`);
    
        //     // Verificar que la respuesta tenga un código de estado 404 y el mensaje adecuado
        //     expect(response.status).toBe(404);
        //     expect(response.body.message).toBe('Travel not found');
        // });
    
        it('should return 500 if there is an internal server error', async () => {
            // Forzar un error en la consulta a la base de datos simulando un error de servidor
            const findStub = sinon.stub(ModelTravel, 'find').rejects(new Error('Database error'));
    
            // Crear un token JWT de prueba
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
    
            // Realizar una solicitud GET al endpoint con cualquier ID de viaje y el token JWT
            const response = await request(app)
                .get('/api/travel/food/any_id')
                .set('Authorization', `Bearer ${token}`);
    
            // Verificar que la respuesta tenga un código de estado 500 y el mensaje adecuado
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error retrieving travel');
    
            // Restaurar el stub después de la prueba
            findStub.restore();
        },30000);
    });

    describe('DELETE /api/travel/:id', () => {
        it('should return 200 and delete a travel if travel exists', async () => {
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
    
            const response = await request(app)
                .delete(`/api/travel/${travelId}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.body.message).toBe("Travel deleted");
            expect(response.status).toBe(200);
        });
        it('should return 500 if the process have an error', async () => {
           
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
    
            const response = await request(app)
                .delete('/api/travel/non-existent-id')
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.body.message).toBe("Error Travel delete");
            expect(response.status).toBe(500);
        });
    });

});