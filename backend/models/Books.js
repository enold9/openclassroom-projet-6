const mongoose = require('mongoose')

const thingSchema = mongoose.Schema({
    title: { type: String, required: true},
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    rate: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true }
})

module.exports = mongoose.model('Books', thingSchema);