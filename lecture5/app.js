const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const { seed, deleteDb } = require('./seed');
const user = require('./model/user');
const { genHash, comparePassword, genToken } = require('./utils');

mongoose.connect('mongodb://localhost/library_new', function(err) {
    console.log(err);
    seed();
    // deleteDb()
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send({
        message: 'Welcome to Library API Service!'
    });
});

app.post('/api/v1/signup', async function(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userExists = await user.findOne({ email });
        if (userExists) {
            const error = new Error('User Already Registered!');
            error.statusCode = 400;
            throw error;
        }
        const passwordHash = await genHash(password);
        await user.create({ firstName, lastName, email, password: passwordHash });
        res.send({ message: 'Signup Successful' });
    } catch(e) {
        console.log(e);
        res.status(e.statusCode || 500).send({
            error: e.message
        })
    }
});

app.post('/api/v1/login', async function(req, res) {
    try {
        const { email, password } = req.body;
        const userExists = await user.findOne({ email });
        console.log("Check", userExists);
        if (!userExists) {
            const error = new Error('User Not Found!');
            error.statusCode = 404;
            throw error;
        }
        const match = await comparePassword(password, userExists.password);
        if (!match) {
            const error = new Error('Invalid Credentials!');
            error.statusCode = 400;
            throw error;
        }
        res.send({ token: genToken(userExists) });
    } catch (e) {
        console.log(e);
        res.status(e.statusCode || 500).send({
            error: e.message
        })
    }
})

app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(3000, function() {
    console.log('Server started on Port 3000');
});