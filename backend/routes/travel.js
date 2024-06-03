var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const middleware = require('../middleware');
const {ModelUser,ModelTravel, ModelChecklist} = require('../userModel');
const admin = require('../firebaseConfig'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");


const API_KEY = process.env.api_key_gemmini;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-pro"});

router.post("/", middleware.decodeToken, createTravel);
router.get("/:_id", middleware.decodeToken, getTravel);
router.delete("/:_id", middleware.decodeToken, deleteTravel);
router.patch("/:_id", middleware.decodeToken, updateTravel);
router.get("/food/:_id", middleware.decodeToken, getFoodRecommendations);
/**
 * Description: Creates a new travel record in the database based on the provided data.
    Parameters:
    req: The request object containing the travel data in the request body.
    res: The response object used to send the HTTP response.
    Returns: Sends an HTTP response indicating the success or failure of the travel creation process.
 */
async function createTravel(req, res) {
    try {
        const {firebase_id, country, country_cod, city, description, init_date, finish_date } = req.body;
        
        if (!firebase_id || !country || !country_cod || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const user = await ModelUser.findOne({ firebase_id }).exec(); 
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        let newTravelData = {
            _user_id: user._id,
            country,
            country_cod,
            description,
            suggestions: [],
            city: city || ""
        };

        if(init_date){
            newTravelData.init_date = init_date;
        }

        if(finish_date){
            newTravelData.finish_date = finish_date;
        }

        newTravelData = await addRestaurantRecommendations(newTravelData);
        newTravelData = await addSuggestions(newTravelData);
        
        const newTravel = await ModelTravel.create(newTravelData);

        const checklist = await generateChecklist(newTravelData);

        const newChecklist = new ModelChecklist({
            _checklist_id: newTravel._id,
            elements: checklist.map(element => ({ element, checked: false }))
        });

        const savedChecklist = await newChecklist.save();

        res.status(201).json({ message: "Trip successfully created", travel: newTravel });
    } catch (error) {
        console.error('Error Travel Creation', error);
        res.status(500).json({ message: "Error Travel Creation" });
    }
}
/** 
Description: Retrieves travel information from the database based on the provided travel ID.
Parameters:
req: The request object containing the travel ID in the URL parameters.
res: The response object used to send the HTTP response.
Returns: Sends an HTTP response containing the retrieved travel information or an error message if the travel is not found. 
 */
async function getTravel(req, res) {
    try {
        const { _id } = req.params;
        const travel = await findTravelById(_id);
        
        if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
        }
        
        res.status(200).json({ message: "Travel successfully retrieved", travel });
    } catch (error) {
        console.error('Error retrieving travel', error);
        res.status(500).json({ message: "Error retrieving travel" });
    }
}
/**
Description: Finds a travel record in the database based on the provided travel ID.
Parameters:
_id: The ID of the travel record to find.
Returns: The travel record if found, or null if not found.
 */
async function findTravelById(_id) {
    return await ModelTravel.findOne({ _id });
}
/**
Description: Deletes a travel record from the database based on the provided travel ID.
Parameters:
req: The request object containing the travel ID in the URL parameters.
res: The response object used to send the HTTP response.
Returns: Sends an HTTP response indicating the success or failure of the travel deletion process.
 */
async function deleteTravel(req, res) {
    try {
        const { _id } = req.params;
        const deletedTravel = await deleteTravelById(_id);
        
        if (!deletedTravel) {
            return res.status(404).json({ message: "Travel not found" });
        }
        
        res.status(200).json({ message: "Travel deleted", deletedTravel });
    } catch (error) {
        console.error('Error Travel delete', error);
        res.status(500).json({ message: "Error Travel delete" });
    }
}
/**
Description: Updates a travel record in the database based on the provided data.
Parameters:
req: The request object containing the travel ID in the URL parameters and the updated travel data in the request body.
res: The response object used to send the HTTP response.
Returns: Sends an HTTP response indicating the success or failure of the travel update process.
 */
async function updateTravel(req, res) {
    try {
        const { _id } = req.params;
        const { country, country_cod, city, description, init_date, finish_date } = req.body;

        if (!country && !country_cod && !city && !description && !init_date && !finish_date) {
            return res.status(400).json({ message: "At least one variable must be changed" });
        }

        const travel = await ModelTravel.findById(_id);
        
        if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
        }

        if (country) {
            travel.country = country;
            await addRestaurantRecommendations(travel);
        }

        if (country_cod) travel.country_cod = country_cod;
        if (city) travel.city = city;
        if (description) travel.description = description;
        if (init_date) travel.init_date = init_date;
        if (finish_date) travel.finish_date = finish_date;

        const suggestions = await addSuggestions(travel);
        travel.suggestions = suggestions.suggestions;

        await travel.save();

        const checklist = await generateChecklist(travel);
        await updateChecklist(_id, checklist);

        res.status(200).json({ message: "Travel Updated", travel });
    } catch (error) {
        console.error('Error Travel Update', error);
        res.status(500).json({ message: "Error Travel Update" });
    }
}

/**
Description: Retrieves restaurant recommendations for a specific travel from the database based on the provided travel ID.
Parameters:
req: The request object containing the travel ID in the URL parameters.
res: The response object used to send the HTTP response.
Returns: Sends an HTTP response containing the retrieved restaurant recommendations or an error message if the travel is not found.
 */
async function getFoodRecommendations(req, res) {
    try {
        const { _id } = req.params;
        const travels = await ModelTravel.find({ _id });

        if (travels.length === 0) {
            return res.status(404).json({ message: "Travel not found" });
        }

        const travel = travels[0];

        res.status(200).json({ 
            message: "Travel successfully retrieved", 
            restaurant_recommendations: travel.restaurant_recomendations 
        });
    } catch (error) {
        console.error('Error retrieving travel', error);
        res.status(500).json({ message: "Error retrieving travel" });
    }
}
/**
Description: Deletes a travel record from the database based on the provided travel ID.
Parameters:
_id: The ID of the travel record to delete.
Returns: The deleted travel record if successful, or null if the travel is not found.
 */
async function deleteTravelById(_id) {
    return await ModelTravel.findByIdAndDelete(_id);
}
async function updateChecklist(_id, checklist) {
    const existingChecklist = await ModelChecklist.findOne({ _checklist_id: _id });

    if (existingChecklist) {
        existingChecklist.elements = checklist.map(element => ({ element, checked: false }));
        await existingChecklist.save();
    } else {
        console.log('No se encontró la lista de verificación para actualizar');
    }
}
/**
Description: Adds restaurant recommendations to the provided travel data by generating recommendations based on the country.
Parameters:
travel: The travel data object to which restaurant recommendations need to be added.
Returns: The updated travel data object with restaurant recommendations.
 */
async function addRestaurantRecommendations(newTravelData) {
    
    const prompt = `searches the internet for food ordering applications used in this country ${newTravelData.country},
     returns three applications separate by a coma and not numerate
     example Mjam, Lieferando, Uber Eats`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const appsList = response.text();
    
    newTravelData.restaurant_recomendations = appsList.split(',').map(app => app.trim());
    
    return newTravelData;
}
/**
Description: Adds suggestions for places and activities to the provided travel data by generating suggestions based on various parameters.
Parameters:
newTravelData: The travel data object to which suggestions need to be added.
Returns: The updated travel data object with suggestions.
 */
async function addSuggestions(newTravelData) {
    const prompt = `Based on the information provided:
        - Country: ${newTravelData.country}
        - City: ${newTravelData.city}
        - Description: ${newTravelData.description} 
        - Start Date: ${newTravelData.init_date}
        - End Date: ${newTravelData.finish_date}
        
        Generate a list of 5 suggestions for places and/or activities during the trip,
        including location and a brief description for each suggestion, in JSON format.
        Provide the answer in the language used in the Description (${newTravelData.description}) english or spanish only.
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
        const result = await model.generateContent(prompt);
        const response = result.response;
        const cleanResponse = response.text().replace(/```json|```/g, '').trim();
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

    return newTravelData;
}
/**
Description: Generates a checklist of items for the provided travel data by generating items based on various parameters.
Parameters:
newTravelData: The travel data object for which the checklist needs to be generated.
Returns: An array containing the generated checklist items.
 */
async function generateChecklist(newTravelData) {
    const prompt = `Based on the information provided:
        - Country: ${newTravelData.country}
        - City: ${newTravelData.city}
        - Description: ${newTravelData.description}
        - Start Date: ${newTravelData.init_date}
        - End Date: ${newTravelData.finish_date}
        - Places to visit: ${newTravelData.suggestions}
    
        Search the internet and generate a list of 10 items I must bring on this type of trip.
        Provide the answer in the language used in the Description (${newTravelData.description}) english or spanish only.
        The list should be separated by commas and should not be numbered.`;

    let checklist = [];
    while (true) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            checklist = response.text().split(',').map(item => item.trim());
            // Check if the checklist meets the required format
            if (Array.isArray(checklist) && checklist.length === 10 && checklist.every(item => item.trim() !== "")) {
                break;
            } else {
                console.error("Invalid checklist format, retrying...");
            }
        } catch (error) {
            console.error("Error generating checklist:", error);
        }
    }

    return checklist;
}


module.exports = router;