const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const { seed, deleteDb } = require('./seed');
const user = require('./model/user');
const { genHash, comparePassword, genToken, verifyToken } = require('./utils');

async function connectDB() {
    const url = 'mongodb+srv://admin:admin@cluster0.xjkyg.mongodb.net/library?retryWrites=true&w=majority';
    return new Promise((res, rej) => {
        mongoose.connect(url, async function(err) {
            if (err) {
                console.log(err);
                rej(err);
            }
            await seed();
            res('Connected to DB');
            // deleteDb()
        });
    }) 
}

async function main() {
    try {
        await connectDB();

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
        
        app.use('/api/v1/*', async function(req, res, next) {
            // console.log("I am in the middleware", req.headers);
            try {
                const authHeader = req.headers['authorization'];
        
                if (!authHeader) {
                    return res.status(401).send({
                        error: 'User not authorized!'
                    });
                } else {
                    const token = authHeader.split('Bearer ')[1];
                    const decoded = await verifyToken(token);
                    req.userEmail = decoded.email;
                    req.userType = decoded.userType;
                }
                next();
            } catch(e) {
                console.log(e);
                return res.status(400).send({
                    error: e.message
                })
            }
        })
        
        app.use('/api/v1/books', bookRoutes);
        app.use('/api/v1/users', userRoutes);
        
        app.listen(3000, function() {
            console.log('Server started on Port 3000');
        });
    } catch(e) {
        console.log(e);
    }
}

main()