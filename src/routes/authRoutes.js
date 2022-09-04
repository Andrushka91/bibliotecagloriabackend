const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, userType, password } = req.body;
    console.log("signup:", req.body)
    try {
        const user = new User({ name, email, userType, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'KEYL');
        res.send({ token });
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(422).send({ error: 'Email not found' })
    }
    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, 'KEYL');
        const userName = user.name;
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' })
    }
})

router.get('/getUser', async (req, res) => {
    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'KEYL', function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.findById(decoded.userId, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            const userObj = { name: user.name, email: user.email }
            res.status(200).send(userObj);
        });
    });

});

module.exports = router;