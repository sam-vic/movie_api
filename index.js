const express = require('express'),
    morgan = require('morgan')
const app = express()

let topMovies = [
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


// Morgan logs
app.use(morgan('combined'))

//Endpoints
// Movie data
app.get('/movies', (req, res) => {
    res.json(topMovies)
})

// Home page
app.get('/', (req, res) => {
    res.end('This is the default')
})

//Route to static documentation page
app.use('/documentation', express.static('public/documentation.html'))

//Error handling middleware  
app.use((err, req, res, next) => {
    console.err(err.stack)
    res.status(500).send('Oops something went wrong!')
})

app.listen(8080, () =>{
    console.log('app is up at \n localhost:8080')
})