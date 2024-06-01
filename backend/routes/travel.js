var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const middleware = require('../middleware');
const {ModelUser,ModelTravel} = require('../userModel');
const admin = require('../firebaseConfig'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");



// CREAR UN VIAJE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/", middleware.decodeToken,async (req, res) => {
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


// OBTENER TODA LA INFORMACION DE UN VIAJE//////////////////////////////////////////////////////////////////////////////////////////
router.get("/:_id", middleware.decodeToken, async (req, res) => {
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

//ELIMINAR VIAJE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.delete("/:_id", middleware.decodeToken, async (req, res) => {
    try {
        const { _id } = req.params;

        // Buscar el viaje por su ID y eliminarlo de la base de datos
        const deletedTravel = await ModelTravel.findByIdAndDelete(_id);
        
        if (!deletedTravel) {
            return res.status(404).json({ message: "Travel not found" });
        }

        res.status(200).json({ message: "Travel deleted", deletedTravel });
    } catch (error) {
        console.error('Error Travel delete', error);
        res.status(500).json({ message: "Error Travel delete" });
    }
});

// Update travel//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.patch("/:_id", middleware.decodeToken, async (req, res) => {
    try {
        const { _id } = req.params;
        const { country, country_cod, city, description, init_date, finish_date } = req.body;

        // Verificar si se proporciona al menos un campo para actualizar
        if (!country && !country_cod && !city && !description && !init_date && !finish_date) {
            return res.status(400).json({ message: "At least one variable must be changed" });
        }

        // Buscar el viaje por su ID
        const travel = await ModelTravel.findById(_id);
        
        if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
        }
        const API_KEY = process.env.api_key_gemmini;
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({model: "gemini-pro"});
        // Si se ha modificado el país, se vuelve a generar la lista de recomendaciones de restaurantes
        if (country) {
            travel.country = country;
            const prompt = `searches the internet for food ordering applications used in this country ${travel.country},
             returns three applications separate by a coma and not numerate
             example Mjam, Lieferando, Uber Eats`;
            const result_g = await model.generateContent(prompt);
            const response_g = await result_g.response;
            const appsList = response_g.text();
            travel.restaurant_recomendations = appsList.split(',').map(app => app.trim());
        }
        if (country_cod) travel.country_cod = country_cod;
        if (city) travel.city = city;
        if (description) travel.description = description;
        if (init_date) travel.init_date = init_date;
        if (finish_date) travel.finish_date = finish_date;

        // Se genera el nuevo prompt para las sugerencias
        const prompt_suggestions =`Based on the information provided:
        - Country: ${travel.country}
        - City: ${travel.city}
        - Description: ${travel.description} give me answer base on this language, the language of the description
        - Start Date: ${travel.init_date}
        - End Date: ${travel.finish_date}
    
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

        // Se genera la nueva lista de sugerencias
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

        // Se actualizan las sugerencias del viaje
        travel.suggestions = suggestions;

        // Guardar los cambios en la base de datos
        await travel.save();

        res.status(200).json({ message: "Travel Updated", travel });
    } catch (error) {
        console.error('Error Travel Update', error);
        res.status(500).json({ message: "Error Travel Update" });
    }
});

module.exports = router;