const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: ''
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    description: {
        type: String,
        required: true
    },
    image: {
        data: String,
        contentType: String
    }
})

mongoose.model('Book', bookSchema);
