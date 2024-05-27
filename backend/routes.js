const express = require('express');
const router = express.Router();
const {ModelUser,ModelTravel,ModelChecklist} = require('./userModel');
const auth = require('./firebaseConfig');

// CREAR UN USUARIO ( REGISTRO )

router.post("/register", async (req, res) => {
    try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const userRecord = await auth.createUser({
        email,
        password,
        displayName: username,
    })

    const newUser = await ModelUser.create({
        uid: userRecord.uid,
        username,
        email,
    });
    res.status(201).json({ message: "Usuario creado con éxito.", user: newUser });
    } catch (error) {
    console.error('Error al registrar nuevo usuario:', error);
    res.status(500).json({ message: "Error al registrar nuevo usuario." });
    }
});

module.exports = router;