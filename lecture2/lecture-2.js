// Readline for NodeJs Command Line
// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// rl.question("Hello, what is your name\n", name => {
//     rl.question('What is you age\n', age => {
//         console.log("Hello " + name + " , age " + age);
//         console.log(age.split(','))
//         rl.close();
//     });
// });

const http = require('http');
const fs = require('fs');

const server = http.createServer(function(req, res) {
    // console.log(req.method, req.url);
    const fileName = __dirname + (req.url === '/' ? '/index' : req.url) + '.html';
    console.log(fileName);
    fs.readFile(fileName, function(err, file) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(file);
    })
});

server.listen(3000, function() {
    console.log('Server started on port 3000');
});
