const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const bookSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
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
    cartQuantity: {
        type: Number
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }

})
bookSchema.plugin(mongoosePaginate);
mongoose.model('Book', bookSchema);
