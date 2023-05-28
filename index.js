// logic for whole server enpoints
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
app.use(bodyParser.urlencoded({ extended: true }))

// Morgan logs
app.use(morgan("combined"));

//importing in Cross-Origin-Resourse-Sharing
const cors =require('cors')
let allowedOrigins = 'http://localhost:8080'

const { check, validationResults } = require('express-validator')

//logic to run cross origin validation
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true, 'not an origin');
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}))

//importing auth logic
const passport = require('passport')
require('./passport.js')
let auth = require('./auth.js')(app)


//Endpoints
app.get("/", (req, res) => {
  res.send("Server is running");
})

// Movie data
app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movies) => {
    res.status(201).json(movies)
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send("Error:" + err)
  })
})

//Movie based on genre thorugh /genres, and /movies
app.get('/genres/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err)
    })
})

//Get User list
app.get("/users", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users)
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send("Error:" + err)
  })
})

//Get User by username
app.get("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((users) => {
    if(!users) {
      return res.status(400).send(" Unable to find_" + req.body.Username);
    } else {
      res.status(201).json(users)
    }
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send("Error:" + err)
  })
})

//Creating a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post("/users", (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password)
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists ");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
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
})
//Update user
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    );
    res.json(updatedUser)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error: ' + error)
  }
})

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => {
  console.log("app is up at \n localhost:8080");
});
