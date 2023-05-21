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
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movies) => {
    res.status(201).json(movies)
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send("Error:" + err)
  })
})

//Movie based on genre
app.get("/movies/:genreName", (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
  .then((movies) => {
    res.status(201).json(movies)
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send("Error:" + err)
  })
})

//Get User list
app.get("/users", (req, res) => {
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
app.get("/users/:Username", (req, res) => {
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
app.put('/users/:Username', async (req, res) => {
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

app.delete('/users/:Username', (req, res) => {
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
