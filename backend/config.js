const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const dbconnect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.PASSWORD}@cluster0.pe6nq66.mongodb.net/${process.env.DB_NAME}`)
        console.log("Conexión correcta a la base de datos");
    } catch (error) {
        console.error("Error de conexión a la base de datos:", error.message);
    }
};

module.exports = dbconnect