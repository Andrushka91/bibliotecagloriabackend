const express = require('express');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const Book = mongoose.model('Book');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();
router.use(requireAuth);


router.post('/book', async (req, res) => {
    const { title, author, description, price, quantity, category, image } = req.body;

    if (!title || !author || !description || !price || !image) {
        return res.status(422).send({ error: 'You must provide the name, author and image of the book' });
    }
    try {
        const cartQuantity = 1;
        const book = new Book({ title, author, description, price, category, quantity, cartQuantity, image });
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.get("/search", async (req, res) => {
    const searchedField = req.query.title;
    await Book.find({ title: { $regex: searchedField, $options: '$i' } })
        .then(data => {
            res.send({ items: data, totalItems: data.length })
            // res.send(data);
        })
})

router.get('/booksm', async (req, res, next) => {
    const books = await Book.find();
    res.send(books);
});



router.get('/books', (req, res) => {
    try {
        const options = {
            page: parseInt(req.query.page),
            limit: parseInt(req.query.itemsPerPage),
            collation: {
                locale: 'en',
            },
        };
        Book.paginate({}, options, function (err, result) {
            // result.docs
            // result.totalDocs = 100
            // result.limit = 10
            // result.page = 1
            // result.totalPages = 10
            // result.hasNextPage = true
            // result.nextPage = 2
            // result.hasPrevPage = false
            // result.prevPage = null
            // result.pagingCounter = 1
            res.send({ items: result.docs, totalItems: result.totalDocs })
        });

    } catch (err) {
        return res.status(500).json(err);
    }
})



router.get("/book/:bookId", (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
        .select('title author image _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    book: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/books'
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


module.exports = router;