// logic for whole server enpoints
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

//port
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

//local connect
{/*mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/}


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
const cors = require('cors')
let allowedOrigins = 'http://localhost:8080'

const { check, validationResult } = require('express-validator')

//logic to run cross origin validation
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true, 'not an origin');
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
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
      if (!users) {
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

app.post("/users",
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    let hashedPassword = Users.hashPassword(req.body.Password)
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists ")
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => {
              res.status(201).json(user)
            })
            .catch((error) => {
              console.error(error)
              res.status(500).send("Error: " + error)
            })
        }
      })
      .catch((error) => {
        console.error(error)
        res.status(500).send("Error: " + error)
      })
  })

//Update user
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  //code validation
  [
    check('Username', 'Username').optional().isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').optional().isAlphanumeric(),
    check('Password', 'Password').optional().not().isEmpty(),
    check('Email', 'Email does not appear to be valid').optional().isEmail(),
    check('Birthday', 'Input does not appear to be valid').optional().custom((value, { req }) => {
      // Custom validation logic
      const birthdayRegex = /^\d{2}\/\d{2}\/\d{2}$/; // Regex pattern for "00/00/00" format
      if (!birthdayRegex.test(value)) {
        throw new Error('Invalid birthday format');
      }
      return true;
    })
  ],
  async (req, res) => {
    try {
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      //hashing new password
      let hashedPassword = Users.hashPassword(req.body.Password);


      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $set: {
            Username: req.body.Username,
            Password: hashedPassword,
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

app.put('/users/:Username/Favourite_movies', passport.authenticate('jwt', { session: false }),
  [
    check('Favourite_movies', 'Undefined input').not().isEmpty().isAlpha().isLength({ min: 5 }),
    check('Favourite_movies', 'Favourite movies is not available').optional().custom((value, { req }) => {
      // Custom validation logic for checking if the movie exists
      return Movies.exists({ Title: value })
    })
  ],
  async (req, res) => {
    try {
      let errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

      const movieTitle = req.body.Favourite_movies

      // Check if the movie exists in the database
      const movie = await Movies.findOne({ Title: movieTitle })
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' })
      }

      // Get the user by their username
      const user = await Users.findOne({ Username: req.params.Username })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Check if the movie is already in the user's favorite movies
      const favoriteMovies = user.Favourite_movies.map(m => m.toString())
      if (favoriteMovies.includes(movie._id.toString())) {
        return res.status(400).json({ error: 'Movie already in favorites' })
      }

      // Add the movie to the user's favorite movies array
      user.Favourite_movies.push(movie._id)
      const updatedUser = await user.save()

      res.json(updatedUser)
    } catch (error) {
      console.error(error)
      res.status(500).send('Error: ' + error)
    }
  }
)



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

const port = process.env.PORT || 8080
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port)
})

//importing local files to mongoAtlas to seed the database
//mongoimport --uri mongodb+srv://myFlixDB:Qwer741123@cluster0.xmni83o.mongodb.net/myFlixDB? --collection movies  --type json --file ../../movies.json

