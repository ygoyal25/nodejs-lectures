const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');

mongoose.connect('mongodb://localhost/library_new', function(err) {
    console.log(err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send({
        message: 'Welcome to Library API Service!'
    });
})

app.use('/api/v1/books', bookRoutes);

app.listen(3000, function() {
    console.log('Server started on Port 3000');
});