const express = require('express'),
 morgan = require('morgan'),
 fs = require('fs'),
 path = require('path')

const app = express()
const accessLogStream = fs.createWriteStream(path.join(__dirname, './log.txt/log.text'), {flags: 'a'})

let topBooks = [
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling'
    },
    {
        title: 'Lord of the Rings',
        author: 'J.R.R. Tolkien'
    },
    {
        title: 'Twilight',
        author: 'Stephanie Meyer'
    }
];

let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
};

let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
};

app.use(morgan('combined', {stream: accessLogStream}))
app.use(myLogger);
app.use(requestTime);

// GET requests (endpoints)
app.get('/', (req, res) => {
    let responseText = 'Welcome to my app!';
    responseText += '<small>Requested at: ' + req.requestTime + '</small>';
    res.send(responseText);
});

app.get('/secreturl', (req, res) => {
    let responseText = 'This is a secret url with super top-secret content.';
    responseText += '<small>Requested at: ' + req.requestTime + '</small>';
    res.send(responseText);

});

app.get('/documentation', (req, res) => {
    res.sendFile('./server/documentation.html', { root: __dirname });
});

app.get('/books', (req, res) => {
    res.json(topBooks);
});


// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});