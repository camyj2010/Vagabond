const admin = require('firebase-admin');
const serviceAccount = require('./vagabond-9b271-firebase-adminsdk-ax0ml-1ea896b62a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

module.exports = auth;