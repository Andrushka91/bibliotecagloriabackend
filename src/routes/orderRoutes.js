const express = require('express');
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Book = mongoose.model('Book');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth')
router.use(requireAuth);

router.post('/order', async (req, res) => {
    const { orderId, userName, userEmail, cartItems, totalPrice } = req.body;
    if (!orderId || !userName || !userEmail || !cartItems || !totalPrice) {
        return res.status(422).send({ error: 'You must provide items in the cart to create the order' })
    }
    try {
        let booksIds = [];
        cartItems.forEach(async (item) => {
            booksIds.push(item.id)
        })

        cartItems.forEach(cartItem => {
            console.log(cartItem)
            Book.findByIdAndUpdate(cartItem.id, { $inc: { 'quantity': -cartItem.cartQuantity } }, (err, result) => {
                if (err) {
                    res.status(422).send({ error: err.message });
                }
            })
        })

        const books = await Book.find({ _id: { $in: booksIds } }).then((data) => {
            data.forEach((item) => {
                cartItems.forEach((itemCart) => {
                    if (itemCart.id == item._id) {
                        item.cartQuantity = itemCart.cartQuantity;
                    }
                })
            })
            return data;
        })
        const status = 'pending'; // pending, canceled, complete.
        const order = new Order({ orderId, userName, userEmail, totalPrice, status, books });
        await order.save();
        res.send(order);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
})

router.get('/orders', async (req, res, next) => {
    const orders = await Order.find();
    res.send(orders);
});


module.exports = router;