# movie_api
Custom api through node.js


This is a personal project named myFlixDB (movie_api).

Tech stack used: [ HTML, CSS, Javascript, Node.js, Express, mongoDB(Atlas), Heroku ]

This project backend is written in node.js to write up the API endpoint under the index.js file. Which calls on the APIs hosted on Heroku, collecting the relavant data from mongoAtlas.

The app allows new Users to register, with sercuity done through hashing passwords and jwt requiremnts for excessing apis. 

API calls are done through the use of Postman.

Examples:
////Creating a user////
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
  
  ///// mongoose.Schema ////
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  })
<img width="1432" alt="Screenshot 2023-06-05 at 5 48 24 PM" src="https://github.com/sam-vic/movie_api/assets/64434536/e804333d-aa53-4035-bd5e-a3fa2a9f3606">
<img width="1431" alt="Screenshot 2023-06-05 at 5 49 23 PM" src="https://github.com/sam-vic/movie_api/assets/64434536/19896afe-5825-41f1-8d44-d449b2b39e92">
