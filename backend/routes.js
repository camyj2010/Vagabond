const express = require('express');
const router = express.Router();
const {ModelUser,ModelTravel,ModelChecklist} = require('./userModel');
const admin = require('./firebaseConfig'); 
const middleware = require('./middleware');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// CREAR UN USUARIO ( REGISTRO )

router.post("/register", async (req, res) => {
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

// CREAR UN VIAJE
router.post("/travel", middleware.decodeToken,async (req, res) => {
    try {
        const {firebase_id,country,city,description, init_date,finish_date } = req.body;

    if (!firebase_id || !country || !description || !init_date || !finish_date) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Buscar el usuario por firebase_id
    const user = await ModelUser.findOne({ where: { firebase_id } });
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const _user_id = user._user_id;

    const newTravelData = {
        _user_id,
        country,
        description,
        suggestions: []
    };

    if (city) {
        newTravelData.city = city;
    }
    if(init_date){
        newTravelData.init_date=init_date;
    }
    if(finish_date){
        newTravelData.finish_date=finish_date;
    }

    //Gemini restaurant_recomendations
    const API_KEY = process.env.api_key_gemmini;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const prompt= "searches the internet for food ordering applications used in this country, returns three applications separate by a coma and not numerate"+newTravelData.country;
    const result_g= await model.generateContent(prompt);
    const response_g = await result_g.response;
    const appsList = response_g.text();
    newTravelData.restaurant_recomendations = appsList.split(',').map(app => app.trim());


    //Gemini suggestions
    const prompt_suggestions = `Based on the information provided:
    - Country: ${newTravelData.country}
    - Description: ${newTravelData.description}
    - Start Date: ${newTravelData.init_date}
    - End Date: ${newTravelData.finish_date}

    Generate a list of 5 suggestions for places and/or activities during the trip,
    including location and a brief description for each suggestion, in JSON format.
    `;
    const result_g_suggestions= await model.generateContent(prompt_suggestions);
    const response_g_suggestions = await result_g_suggestions.response;
    //Clean Answer
    const cleanResponse = response_g_suggestions.text().replace(/```json|```/g, '').trim();
    console.log("Cleaned Response:", cleanResponse); // Para depuración
    const suggestions = JSON.parse(cleanResponse);
    newTravelData.suggestions = suggestions;




    const newTravel = await ModelTravel.create(newTravelData);

    res.status(201).json({ message: "Trip successfully created", travel: newTravel });
    }catch (error) {
    console.error('Error Travel Creation', error);
    res.status(500).json({ message: "Error Travel Creation" });
    }});

module.exports = router; 