const admin = require('firebase-admin');
const key = require('../config/firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(key)
});

const db = admin.firestore();

module.exports = db;