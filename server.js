const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const morgan = require("morgan");
morgan;

const fs = require("fs");
const app = express();

const jsonData = fs.readFileSync("./json/movies.json");
const data = JSON.parse(jsonData);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Morgan logs
app.use(morgan("combined"));

//Endpoints
app.get("/", (req, res) => {
  res.send("Server is running");
})

// Movie data
app.get("/movies", (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies)
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send("Error:" + err)
  })
});
//Movie based on title
app.get("/movies/:title", (req, res) => {
  res.json(
    data.movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

app.get("/genre/:name", (req, res) => {
  const genreName = req.params.name;
  const genreMovies = data.movies.filter((movie) => movie.genre === genreName);
  if (genreMovies.length === 0) {
    return res.status(404).send("No match");
  } else if (genreMovies.length === 1) {
    return res.json(genreMovies[0]);
  } else {
    return res.json(genreMovies);
  }
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

app.listen(8080, () => {
  console.log("app is up at \n localhost:8080");
});
