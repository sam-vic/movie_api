// logic for whole server enpoints
const mongoose = require("mongoose");
const Models = require("./models.js");


const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director

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
let allowedOrigins = 'http://localhost:8080, http://localhost:1234'

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

//importing auth logic//
const passport = require('passport')
require('./passport.js')
let auth = require('./auth.js')(app)


//////////////Endpoints/////////////////////
app.get('/', (req, res) => {
  res.send("Server is running");
})

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send("Error:" + err)
    })
})

///////// Get movie based on title//////////////////
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.status(201).json(movies)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send("Error:" + err)
    })
})

///////// Get movie based on movie id//////////////////
app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movies.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

//////// Get Movie based on genre ////////
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
//////// Add new directors to the list ////////
app.post('/directors',
  [
    check('Name', 'Director name is required').not().isEmpty().isLength({ min: 5 }),
    check('Description', 'Invalid sescription').isLength({ min: 10 }),
    check('Movies', 'Invalid Input').not().isEmpty()
  ],
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    Directors.findOne({ Name: req.body.Name })
      .then((director) => {
        if (director) {
          return res.status(400).send(req.body.Name + " already exists ")
        } else {
          Directors.create({
            Name: req.body.Name,
            Description: req.body.Description,
            Movies: req.body.Movies
          })
            .then((director) => {
              res.status(201).json(director)
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
//// List of all Directors ////
app.get('/directors', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Directors.find()
      .then((directors) => {
        res.status(201).json(directors)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send("Error:" + err)
      })
  })
//// Get Director info my Name////
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Directors.findOne({ Name: req.params.Name })
      .then((directors) => {
        res.status(201).json(directors)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send("Error:" + err)
      })
  })

////Creating a user////
/* 
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',
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

  // pulls up all of user's favMovies
  app.get('/users/:Username/favoriteMovies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const user = await Users.findOne({ Username: req.params.Username })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(user.FavoriteMovies)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Server error' })
    }
  })

// allow user to add favmovies to their favMovie arry
app.post('/users/:Username/favoriteMovies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { Username } = req.params
    const { movieId } = req.body

    const user = await Users.findOne({ Username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const movie = await Movies.findById(movieId)
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    if (user.FavoriteMovies.includes(movieId)) {
      return res.status(409).json({ message: 'Movie already in favorites' })
    }

    user.FavoriteMovies.push(movieId)
    await user.save()

    res.status(200).json({ message: 'Movie added to favorites' })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
})

//Update user////
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

      const updatedUserFields = {
        Username: req.body.Username,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }

      //hashing new password
      if (req.body.Password) {
        // Only update the password if it's provided in the request
        const hashedPassword = Users.hashPassword(req.body.Password)
        updatedUserFields.Password = hashedPassword
      }
      //let hashedPassword = Users.hashPassword(req.body.Password);


      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $set: updatedUserFields },
        { new: true }
      )

      res.json(updatedUser)
    } catch (error) {
      console.error(error)
      res.status(500).send('Error: ' + error)
    }
  })

////////// Get User list ////////
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send("Error:" + err)
    })
})

///////Get User by username//////
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

////// Deleting a user by Username //////
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

