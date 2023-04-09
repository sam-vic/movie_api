const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid')
const morgan = require('morgan')
morgan

const fs = require('fs')
const app = express()


const jsonData = fs.readFileSync('./json/movies.json')
const data = JSON.parse(jsonData)

app.use(bodyParser.json())


// Morgan logs
app.use(morgan('combined'))

//Endpoints
// Movie data
app.get('/movies', (req, res) => {
    res.json(data)
})
//Movie based on title 
app.get('/movies/:title', (req, res) => {
    res.json(data.movies.find((movie) => {
        return movie.title === req.params.title
    }))
})

app.get('/genre/:name', (req, res) => {
    const genreName = req.params.name
    const genreMovies = data.movies.filter(movie => movie.genre === genreName)
    if (genreMovies.length === 0) {
        return res.status(404).send('No match');
    } else if (genreMovies.length === 1) {
        return res.json(genreMovies[0]);
    } else {
        return res.json(genreMovies);
    }
})

app.listen(8080, () => {
    console.log('app is up at \n localhost:8080')
})