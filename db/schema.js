const mongoose = require('mongoose');
const { Schema } = mongoose;

const librarySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    comments: [String],
}, { timestamps: false, versionKey: false }) ;

module.exports = librarySchema;