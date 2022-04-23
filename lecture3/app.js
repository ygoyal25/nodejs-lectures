const express = require('express');
const app = express();
const path = require('path');

// Set the template engine
app.set('view engine', 'ejs');
// Set the location of templates
app.set('views', path.join(__dirname, 'views'));
// app.set('views', __dirname + '/views'); // Paths are created differently in different OS 

// Route -- 
// GET, POST, PUT, PATCH, DELETE

app.get('/', function (req, res) {
    res.render('download.ejs');
})

app.get('/test', function(req, res) {
    res.send("This is test file");
})

app.get('*', function(req, res) {
    res.send("Page Not Found");
})

app.listen(3000)