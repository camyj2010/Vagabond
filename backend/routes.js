const express = require('express');
const router = express.Router();
const {ModelUser,ModelTravel,ModelChecklist} = require('./userModel');
const admin = require('./firebaseConfig'); 
const middleware = require('./middleware');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// CREAR UN USUARIO ( REGISTRO )/////////////////////////////////////////////////////////////////////////////////////////////////////////////////7

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

// CREAR UN VIAJE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/travel", middleware.decodeToken,async (req, res) => {
    try {
        const {firebase_id,country,country_cod,city,description, init_date,finish_date } = req.body;
			
    if (!firebase_id || !country || !country_cod || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Buscar el usuario por firebase_id
    // console.log('firebase_id recibido:', firebase_id);
    const user = await ModelUser.findOne({ firebase_id }).exec(); 
    // console.log('Resultado de la búsqueda del usuario:', user);
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const _user_id = user._id;
    console.log("hhhhh",_user_id);

    
    const newTravelData = {
        _user_id,
        country,
        country_cod,
        description,
        suggestions: []
    };

    if (city) {
        newTravelData.city = city;
    }
    if (!city) {
        newTravelData.city = "";
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
    const prompt= `searches the internet for food ordering applications used in this country ${newTravelData.country},
     returns three applications separate by a coma and not numerate
     example Mjam, Lieferando, Uber Eats`;
    const result_g= await model.generateContent(prompt);
    const response_g = await result_g.response;
    const appsList = response_g.text();
    console.log(appsList)
    newTravelData.restaurant_recomendations = appsList.split(',').map(app => app.trim());


    //Gemini suggestions
    const prompt_suggestions =`Based on the information provided:
    - Country: ${newTravelData.country}
    - City: ${newTravelData.city}
    - Description: ${newTravelData.description} give me the answer in this language
    - Start Date: ${newTravelData.init_date}
    - End Date: ${newTravelData.finish_date}

    Generate a list of 5 suggestions for places and/or activities during the trip,
    including location and a brief description for each suggestion, in JSON format.
    Example response:
    [
        {
            "location": "Casa de la Música Habana",
            "description": "A popular nightclub known for its live music, dancing, and lively atmosphere."
        },
        {
            "location": "El Floridita",
            "description": "A historic bar famous for its association with Ernest Hemingway and its classic cocktails."  
        },
        {
            "location" "Cabaret Tropicana",
            "description": "A renowned cabaret venue featuring spectacular dance performances and live music."
        },
        {
            "location" "La Fábrica de Arte Cubano (FAC)",
            "description": "A multidisciplinary art space that showcases exhibitions, live music, and cultural events."  
        },
        {
            "location" "Callejón de Hamel",
            "description": "A colorful street adorned with murals and sculptures, known for its Afro-Cuban music and dance performances."
        }
    ]`;
    // const result_g_suggestions= await model.generateContent(prompt_suggestions);
    // const response_g_suggestions = await result_g_suggestions.response;
    // console.log("Sin modificaciones ",response_g_suggestions.text());
    // //Clean Answer
    // const cleanResponse = response_g_suggestions.text().replace(/```json|```/g, '').trim();
    // console.log("Cleaned Response:", cleanResponse); // Para depuración
    // const suggestions = JSON.parse(cleanResponse);
    // newTravelData.suggestions = suggestions;
    let suggestions = [];
        while (true) {
            const result_g_suggestions = await model.generateContent(prompt_suggestions);
            const response_g_suggestions = result_g_suggestions.response;
            const cleanResponse = response_g_suggestions.text().replace(/```json|```/g, '').trim();
            try {
                suggestions = JSON.parse(cleanResponse);
                if (Array.isArray(suggestions) && suggestions.length === 5 && suggestions.every(s => s.location && s.description)) {
                    break;
                }
            } catch (error) {
                console.error("Invalid JSON format, retrying...", error);
            }
        }
        
    newTravelData.suggestions = suggestions;

    const newTravel = await ModelTravel.create(newTravelData);

    res.status(201).json({ message: "Trip successfully created", travel: newTravel });
    }catch (error) {
    console.error('Error Travel Creation', error);
    res.status(500).json({ message: "Error Travel Creation" });
    }});

// OBTENER TODOS LOS VIAJES DE UN USUARIO//////////////////////////////////////////////////////////////////////////////////////////
router.get("/travels/:firebase_id", middleware.decodeToken, async (req, res) => {
    try {
        const { firebase_id } = req.params;

        // Buscar el usuario por firebase_id
        const user = await ModelUser.findOne({ firebase_id }).exec();
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const _user_id = user._id;

        // Buscar todos los viajes asociados al user_id y seleccionar solo los campos necesarios
        const travels = await ModelTravel.find({ _user_id }).select('_id country country_cod city init_date finish_date').exec();

        res.status(200).json({ message: "Travels successfully retrieved", travels });
    } catch (error) {
        console.error('Error retrieving travels', error);
        res.status(500).json({ message: "Error retrieving travels" });
    }
});

// OBTENER TODA LA INFORMACION DE UN VIAJE//////////////////////////////////////////////////////////////////////////////////////////
router.get("/travel/:_id", middleware.decodeToken, async (req, res) => {
    try {
        const { _id } = req.params;

        // Buscar todos los viajes asociados al user_id y seleccionar solo los campos necesarios
        const travels = await ModelTravel.find({_id});

        res.status(200).json({ message: "Travel successfully retrieved", travels });
    } catch (error) {
        console.error('Error retrieving travel', error);
        res.status(500).json({ message: "Error retrieving travel" });
    }
});
module.exports = router; 