require('./models/User');
require('./models/Book');
require('./models/Order');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');
const requireAuth = require('./middlewares/requireAuth');

const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(authRoutes);
app.use(bookRoutes);
app.use(orderRoutes);

const mongoUri = 'mongodb+srv://admin:admin@literatura.nrooz.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoUri);

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongo', err);
})

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

app.get('/', function (req, res) {
    res.sendFile('index.html');
});
app.listen(3000, () => {
    console.log('Listening on port 3000');
})