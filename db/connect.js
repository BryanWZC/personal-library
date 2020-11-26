const mongoose = require('mongoose');
const Library = require('./model');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

module.exports = {
    connect : async () => {
        await mongoose.connect(process.env.MONGO_URI), { useNewUrlParser: true, useUnifiedTopology: true };
        console.log('DB connected successfully...')
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error'));
    }
}