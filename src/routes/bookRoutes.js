const express = require('express');
const req = require('express/lib/request');
const fs = require("fs");
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth')
const Book = mongoose.model('Book');
const router = express.Router();
router.use(requireAuth);

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime().toString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


router.post('/book', upload.single('image'), async (req, res) => {
    const { title, author, description, price, quantity, image = req.file.path } = req.body;

    if (!title || !author || !description || !price || !image) {
        return res.status(422).send({ error: 'You must provide the name, author and image of the book' });
    }
    try {
        const image = {
            name: req.body.name,
            data: fs.readFileSync(req.file.path).toString('base64'),
            contentType: "image/jpg",
        }
        const book = new Book({ title, author, description, price, quantity, image });
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.get('/books', async (req, res, next) => {
    const books = await Book.find();
    res.send(books);
});


router.get("/book/:bookId", (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
        .select('title author image _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
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