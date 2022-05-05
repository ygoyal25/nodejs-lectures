const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const user = require('../model/user');
const { body, validationResult } = require('express-validator');

router.get('/', async function(req, res) {
    const users = await user.find();
    res.send({
        users
    });
});

router.post('/', async function(req, res) {
    console.log(req.body);
    const userAdded = await user.create(req.body);
    res.send({
        user: userAdded
    });
});

module.exports = router;