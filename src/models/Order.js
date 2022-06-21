const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    books: {
        type: Array,
        required: true
    }
});

mongoose.model('Order',orderSchema);