const express = require('express');
const router = express.Router();
const {ModelUser,ModelTravel,ModelChecklist} = require('./userModel');
const admin = require('./firebaseConfig'); 

// Middleware para verificar el token de Firebase
router.use(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: "Unauthorized." });
    }
});
// CREAR UN USUARIO ( REGISTRO )

router.post("/register", async (req, res) => {
    try {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const newUser = await ModelUser.create({
        username,
        email,
    });
    res.status(201).json({ message: "Usuario creado con éxito.", user: newUser });
    } catch (error) {
    console.error('Error al registrar nuevo usuario:', error);
    res.status(500).json({ message: "Error al registrar nuevo usuario." });
    }
});