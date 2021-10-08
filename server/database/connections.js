const mongoose = require('mongoose')


// making a connection or creation new db


const connectDB = async() =>{
    try{
        const con = await mongoose.connect('mongodb://localhost:27017/NoteTitleApp');
        console.log("Mongo DB connected");
    }
    
    catch(err){
        console.log(err);
        console.log("Connection Unsuccessfull");

    }
}

module.exports = connectDB;


