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

// fs.writeFile(__dirname + '/myfile.txt', 'This is Yash', function(err, data) {
//     console.log(err, data);
// });

// fs.unlink(__dirname + '/myfile.txt', function(err, data) {
//     console.log(err, data);
// });

const server = http.createServer(function(req, res) {
    // console.log(req.method, req.url);
    // Base Route - localhost:3000
    // __dirname --> Global Variable - points to current directory
    const fileName = __dirname + (req.url === '/' ? '/index' : req.url) + '.html';
    console.log(fileName);

    if (!fs.existsSync(fileName)) {
        res.writeHead(404, { 'Content-Type': 'text/html' }); 
        fs.readFile(__dirname + '/404.html', function(err, file) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(file);
        });
    } else {
        fs.readFile(fileName, function(err, file) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(file);
        })
    }
});

server.listen(3000, function() {
    console.log('Server started on port 3000');
});
