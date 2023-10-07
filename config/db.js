const mongoose = require("mongoose")
const colors = require('colors')

const connectDB = async() => {

    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`.green)
    } catch (error){
        console.log(`mongo db Error ${error}` .bgRed .white)
    }
}

module.exports = connectDB