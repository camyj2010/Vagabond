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

router.post("/",middleware.decodeToken, createIngredients);
/**
 * Description: Handles the creation of an ingredient list for a specified food item by making a request to the Google Generative AI API.
 * 
 * Parameters:
 *   req: The request object from the client.
 *     - req.body: The body of the request.
 *       - country: The country where the food is from.
 *       - country_cod: The country code where the food is from.
 *       - food_name: The name of the food item.
 *   res: The response object to be sent back to the client.
 * 
 * Returns: Sends an HTTP response with the list of ingredients or an error message.
 */
async function createIngredients(req, res) {
    try{
        const {country, country_cod, food_name } = req.body;
        if (!food_name || !country || !country_cod ) {
            return res.status(400).json({ message: "All fields are required" });
        }

    // Realizar la solicitud a la API de Gemini para obtener los ingredientes
    const prompt = `give me a list of the ingredients of this food: ${food_name},write it sepeparate by a coma. This food is from ${country}, ${country_cod}. write just the ingredients names
     Example egg, pepper, onion`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const appsList = response.text();
    
    ingredients= appsList.split(',').map(app => app.trim());
    console.log(ingredients);
        return res.status(200).json({ ingredients: ingredients });
    
    } catch (error) {
    console.error("Error fetching ingredients: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
}
}
module.exports = router;