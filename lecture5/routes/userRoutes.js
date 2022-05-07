const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const user = require('../model/user');
const { body, validationResult } = require('express-validator');

router.use('/', async function(req, res, next) {
    console.log('Inside User Route', req.userType);
    if (req.userType === 'ADMIN') {
        return next()
    }
    return res.status(403).send({ error: 'You are not allowed to access this resource' });
})

router.get('/', async function(req, res) {
    const users = await user.find().populate('books');
    res.send({
        users
    });
});

router.post('/', async function(req, res) {
    const userAdded = await user.create(req.body);
    res.send({
        user: userAdded
    });
});

module.exports = router;