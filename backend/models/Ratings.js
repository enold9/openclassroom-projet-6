const mongoose = require('mongoose')

const ratingSchema = mongoose.Schema({
    userId:{ type: String, required: true },
    rating: {type: Number, required: true}
    
})

module.exports = mongoose.model('Ratings', ratingSchema);