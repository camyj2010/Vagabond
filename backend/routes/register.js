var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const middleware = require('../middleware');
const {ModelUser} = require('../userModel');
const admin = require('../firebaseConfig'); 


router.post("/", async (req, res) => {
    try {
        const { username, email, firebase_id } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await ModelUser.create({
        username,
        email,
        firebase_id
    });
    res.status(201).json({ message: "Usuario creado con éxito.", user: newUser });
    } catch (error) {
    console.error('Error al registrar nuevo usuario:', error);
    res.status(500).json({ message: "Error al registrar nuevo usuario." });
    }
});
module.exports = router;