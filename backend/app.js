const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const {ModelUser,ModelTravel,ModelChecklist} = require('./userModel');
const router = express.Router();
const dbconnect = require('./config');
app.use(express.json());
app.use(cors());
app.use(router);

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

app.listen(3001, () => {
    console.log("El servidor esta corriendo en el servidor 3001")
})

module.exports = app
dbconnect();