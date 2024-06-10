// const request = require('supertest');
// const sinon = require('sinon');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const admin = require('../../firebaseConfig');
// const app = require('../../app');
// const {ModelUser,ModelTravel,ModelChecklist} = require('../../userModel');
// const middleware = require('../../middleware');
// const { GoogleGenerativeAI } = require("@google/generative-ai");


// describe('POST /api/food/', () => {
//     let generateContentStub;
//     let verifyIdTokenStub

//     beforeAll(() => {
//         verifyIdTokenStub = sinon.stub(admin.auth(), 'verifyIdToken').resolves({ uid: 'test-uid' });
//     });
    

//     // beforeEach(() => {
//     //     generateContentStub = sinon.stub().resolves({
//     //         response: {
//     //             text: () => "egg, pepper, onion"
//     //         }
//     //     });
//     //     getGenerativeModelStub = sinon.stub(GoogleGenerativeAI.prototype, 'getGenerativeModel').returns({
//     //         generateContent: generateContentStub
//     //     });
//     // });

//     // afterEach(() => {
//     //     getGenerativeModelStub.restore();
//     // });

//     afterAll(() => {
//         verifyIdTokenStub.restore();
//     });

//     it('should return 200 and a list of ingredients if all fields are provided', async () => {
//         const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
//         const response = await request(app)
//             .post('/api/food/')
//             .set('Authorization', `Bearer ${token}`)
//             .send({
//                 country: 'Italia',
//                 country_cod: 'IT',
//                 food_name: 'Lasagna'
//             });
//         expect(response.status).toBe(200);
//         expect(response.body.ingredients.length).toBeGreaterThan(0);
//     });

//     it('should return 400 if any field is missing', async () => {
//         const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
//         const response = await request(app)
//             .post('/api/food/')
//             .set('Authorization', `Bearer ${token}`)
//             .send({
//                 country: 'Test Country',
//                 country_cod: 'TC'
//                 // Missing food_name
//             });

//         expect(response.status).toBe(400);
//         expect(response.body.message).toBe("All fields are required");
//     });

//     // it('should return 500 if there is an internal server error', async () => {
//     //      const token = jwt.sign({ uid: 'test-uid' }, 'your-secret-key', { expiresIn: '1h' });
//     //     generateContentStub.rejects(new Error('API error'));

//     //     const response = await request(app)
//     //         .post('/api/food/')
//     //         .set('Authorization', `Bearer ${token}`)
//     //         .send({
//     //             country: 'Test Country',
//     //             country_cod: 'TC',
//     //             food_name: 'Test Food'
//     //         });

//     //     expect(response.status).toBe(500);
//     //     expect(response.body.message).toBe("Internal Server Error");
//     // });
// });