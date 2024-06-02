var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const middleware = require('../middleware');
const {ModelUser,ModelTravel} = require('../userModel');
const admin = require('../firebaseConfig'); 


router.get("/:firebase_id", middleware.decodeToken,  async (req, res) => {
    try {
        const { firebase_id } = req.params;

        // Buscar el usuario por firebase_id
        const user = await ModelUser.findOne({ firebase_id }).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const _user_id = user._id;

        // Buscar todos los viajes asociados al user_id y seleccionar solo los campos necesarios
        const travels = await ModelTravel.find({ _user_id }).select('_id country country_cod city init_date finish_date').exec();

        // Obtener la fecha actual
        const currentDate = new Date();

        // Dividir los viajes en "currentTravel" y "travels"
        let currentTravel = null;
        const pastAndFutureTravels = [];

        travels.forEach(travel => {
            const initDate = new Date(travel.init_date);
            const finishDate = new Date(travel.finish_date);

            if (currentDate >= initDate && currentDate <= finishDate) {
                currentTravel = travel;
            } else {
                pastAndFutureTravels.push(travel);
            }
        });

        res.status(200).json({ 
            message: "Travels successfully retrieved", 
            travels: pastAndFutureTravels, 
            currentTravel 
        });
    } catch (error) {
        console.error('Error retrieving travels', error);
        res.status(500).json({ message: "Error retrieving travels" });
    }
});
module.exports = router;