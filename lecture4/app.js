const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const todos = [];

// Set the template engine
app.set('view engine', 'ejs');
// Set the location of templates
app.set('views', path.join(__dirname, 'views'));
// app.set('views', __dirname + '/views'); // Paths are created differently in different OS 

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

// Route -- 
// GET, POST, PUT, PATCH, DELETE

app.get('/', function (req, res) {
    res.render('homepage.ejs');
});

app.get('/todos', function(req, res) {
    res.send({ todos });
})

app.post('/todos', function(req, res) {
    console.log(req.body);
    todos.push(req.body.todo);
    res.send({ todos });
})

app.delete('/todos/:index', function(req, res) {
    todos.splice(req.params.index, 1);
    res.send({ status: 'success' });
})

app.listen(3000)