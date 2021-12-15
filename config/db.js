

const mongoose = require('mongoose')
const config = require('config')

const uri = config.get('mongoURI')
//database connection 
const connectDB = async () => {
    try {
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Mongodb Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1)
    }
}

module.exports = connectDB;
