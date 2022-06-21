const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    category:{
        type:String,
        required:true
    },
    image: {
        data: String,
        contentType: String
    }
})
bookSchema.plugin(mongoosePaginate);
mongoose.model('Book', bookSchema);
