const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const book = require('../model/book');
const user = require('../model/user');
const { body, validationResult } = require('express-validator');

router.get('/', async function(req, res) {
    try {
        const books = await book.find();
        res.send({
            books
        });
    } catch(e) {
        console.log(e);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/', [
        body('title', 'Title Should Be String').isString(),
        body('author', 'Author Should Be String').isString(),
        body('copies', 'Copies Should Be Number').isNumeric(),
        body('year', 'Year Should Be Number').isNumeric(),
    ], async function(req, res) {
    try {
        if (req.userType !== 'ADMIN') {
            const error = new Error('Only Admin can add books');
            error.statusCode = 403;
            throw error;
        }

        const errors = validationResult(req);
        console.log('Error', errors.array());

        if (errors.array.length) {
            const error = new Error('Invalid Request');
            error.statusCode = 400;
            throw error
        }

        const addedBook = await book.create(req.body);
        console.log(addedBook);
        res.send(addedBook);
    } catch(e) {
        console.log(e);
        res.status(e.statusCode || 500).send({ error: e.message || 'Internal Server Error' });
    }
});

router.patch('/:bookId', async function(req, res) {
    try {
        console.log(req.body, req.params);
        await book.updateOne({ _id: mongoose.Types.ObjectId(req.params.bookId) }, {
            $set: {
                ...req.body // copies: 12
            }
        })
        res.send({});
    } catch(e) {
        console.log(e);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.delete('/:bookId', async function(req, res) {
    try {
        await book.deleteOne({ _id: mongoose.Types.ObjectId(req.params.bookId) });
        res.send({});   
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/:bookId/borrow', async function(req, res) {
    try {
        const bookToBorrow = await book.findOne({ _id: mongoose.Types.ObjectId(req.params.bookId), copies: { $gt: 0 } });
        if (!bookToBorrow) {
            const error = new Error('Book Not Available!');
            error.statusCode = 404;
            throw error;
        }
        await user.updateOne({ email: req.userEmail }, {
            $push: { books: { _id: bookToBorrow._id } }
        });
        await book.updateOne({ _id: mongoose.Types.ObjectId(req.params.bookId)}, 
            {
                $inc: {
                    copies: -1
            }
        });
        res.send({});
    } catch(e) {
        console.log(e);
        res.status(e.statusCode || 500).send({ error: e.message });
    }
})

module.exports = router;