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


describe('api/checklist/', () => {
    let mongoServer;
    let verifyIdTokenStub;
    let generateContentStub;
    let userId
    let travelId
    let elementId

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
        const travel = new ModelTravel({
            _user_id: userId,
            country: 'Test Country',
            country_cod: 'TC',
            city: 'Test City',
            description: 'Test Description',
            init_date: '2024-07-01T00:00:00Z',
            finish_date: '2024-12-07T00:00:00Z',
        });
        await travel.save();
        travelId = travel._id
        const exampleChecklist = new ModelChecklist({
            _checklist_id: travelId,
            elements: [{ element: 'Element 1', checked: false }, { element: 'Element 2', checked: true }]
        });
        await exampleChecklist.save();

        verifyIdTokenStub = sinon.stub(admin.auth(), 'verifyIdToken').resolves({ uid: 'test-uid' });
    });
    
    afterAll(async () => {
        // Restaurar stubs y limpiar la base de datos después de cada prueba
        sinon.restore();
        verifyIdTokenStub.restore();
        await ModelUser.deleteMany({});
        await ModelTravel.deleteMany({});
        await ModelChecklist.deleteMany({})
        // Cerrar la conexión de mongoose y el servidor en memoria después de todas las pruebas
        await mongoose.disconnect();
        await mongoServer.stop();
    });
    describe('GET /api/checklist/:checklistId', () => {
        it('should return 200 and the checklist if it exists', async () => {
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
            const response = await request(app)
                .get(`/api/checklist/${travelId}`)
                .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
            expect(response.status).toBe(200);
        });
        // it('should return 404 if the checklist does not exist', async () => {
        //     const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        //     const response = await request(app)
        //         .get('/api/checklist/non_existent_checklist_id')
        //         .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization

        //     expect(response.status).toBe(404);
        //     expect(response.body.message).toEqual({ message: "There is not a checklist" });
        // });

        it('should return 500 if there is an error obtaining the checklist', async () => {
            // Simulamos un error en la consulta a la base de datos
            const findStub = sinon.stub(ModelChecklist, 'findOne').rejects(new Error('Database error'));
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
            const response = await request(app)
                .get(`/api/checklist/${travelId}`)
                .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Error in obtaining the checklist." });
            findStub.restore(); // Restaurar el stub después de la prueba
        });

        describe('POST api/checklist/:_checkListId', () => {
            it('should return 200 and add the element to the checklist', async () => {     
                const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
                const response = await request(app)
                    .post(`/api/checklist/${travelId}`)
                    .send({ element: 'New Element' })
                    .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
                elementId = response.body.elements[((response.body.elements).length) - 1]._id
                expect(response.status).toBe(200);
            });
        
            it('should return 400 if element is not specified in the request body', async () => {
                const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
                const response = await request(app)
                    .post('/api/checklist/some_checklist_id')
                    .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
        
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ message: "The element is not specified in the body of the request." });
            });
        
            // it('should return 404 if the checklist does not exist', async () => {
            //     const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
            //     const response = await request(app)
            //         .post('/api/checklist/non_existent_checklist_id')
            //         .send({ element: 'New Element' })
            //         .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
        
            //     expect(response.status).toBe(404);
            //     expect(response.body).toEqual({ message: "Checklist not found" });
            // });
        
            it('should return 500 if there is an error adding the element to the checklist', async () => {
                // Simulamos un error en la actualización de la base de datos
                const findStub = sinon.stub(ModelChecklist, 'findOneAndUpdate').rejects(new Error('Database error'));
                const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
                const response = await request(app)
                    .post(`/api/checklist/${travelId}`)
                    .send({ element: 'New Element' })
                    .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
        
                expect(response.status).toBe(500);
                expect(response.body).toEqual({ message: "Error adding item to the checklist." });
                findStub.restore()
            });
        });
    });
    describe('PATCH /api/checklist/:checklistId/:elementId', () => {
        it('should return 200 and mark the item as checked', async () => {
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
            const response = await request(app)
                .patch(`/api/checklist/${travelId}/${elementId}`)
                .send({ checked: true })
                .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
    
            expect(response.status).toBe(200);
            expect(response.body.elements[((response.body.elements).length) - 1].checked).toBe(true);
        });
    
        // it('should return 404 if the checklist or element does not exist', async () => {
        //     const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        //     const response = await request(app)
        //         .patch('/api/checklist/non_existent_checklist_id/non_existent_element_id')
        //         .send({ checked: true })
        //         .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
    
        //     expect(response.status).toBe(404);
        //     expect(response.body).toEqual({ message: "Checklist not found" });
        // });
    
        it('should return 500 if there is an error marking the item in the checklist', async () => {
            // Simulamos un error en la actualización de la base de datos
            const findStub = sinon.stub(ModelChecklist, 'findOneAndUpdate').rejects(new Error('Database error'));
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
            const response = await request(app)
                .patch(`/api/checklist/${travelId}/${elementId}`)
                .send({ checked: true })
                .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Error marking item in checklist" });
            findStub.restore()
        });
    });
    describe('DELETE /api/checklist/:checklistId', () => {
        it('should return 200 and delete the item from the checklist', async () => {
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
            const response = await request(app)
                .delete(`/api/checklist/${travelId}/${elementId}`)
                .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
    
            expect(response.status).toBe(200);
        });
    
        // it('should return 404 if the checklist or element does not exist', async () => {
        //     const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
        //     const response = await request(app)
        //         .delete('/api/checklist/non_existent_checklist_id/non_existent_element_id')
        //         .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
    
        //     expect(response.status).toBe(404);
        //     expect(response.body).toEqual({ message: "Checklist not found" });
        // });
    
        it('should return 500 if there is an error deleting the item from the checklist', async () => {
            // Simulamos un error en la actualización de la base de datos
            const findStub = sinon.stub(ModelChecklist, 'findOneAndUpdate').rejects(new Error('Database error'));
            const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
            const response = await request(app)
                .delete(`/api/checklist/${travelId}/${elementId}`)
                .set('Authorization', `Bearer ${token}`); // Agrega el encabezado Authorization
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Error deleting item from the checklist." });
            findStub.restore();
        });
    });
});