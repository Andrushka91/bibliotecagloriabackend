const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();
router.use(requireAuth);

router.get('/users', (req, res) => {
    try {
        const options = {
            page: parseInt(req.query.page),
            limit: parseInt(req.query.itemsPerPage),
            collation: {
                locale: 'en'
            },
        };
        User.paginate({}, options, function (err, result) {
            res.send({ items: result.docs, totalItems: result.totalDocs })
        });
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.patch('/user', (req, res) => {
    const { userId, name, email } = req.body;
    try {
        User.findByIdAndUpdate(userId, { name, email },
            (error, updatedItem) => {
                if (error) {
                    res.status(404).send(err.message);
                } else {
                    res.send("Utilizatorul " + updatedItem.name + " a fost actualizat cu success.");
                }
            })
    } catch (error) {
        console.log("Error:", error.message)
    }
})

router.delete('/user', (req, res) => {
    const { userId } = req.body;
    User.findByIdAndRemove(userId, (error, deletedItem) => {
        if (error) {
            res.status(404).send(err.message);
        } else {
            console.log('deletedItem:',deletedItem)
            res.send("Utilizatorul " + deletedItem + " a fost eliminat cu success.");
        }
    })
})


module.exports = router;