// Creat new endpoint for registered users to log in
// Uses LocalStrategies to check username and password exist in the database

//This is the same key used in the JWTStrategy
const jwtSecret = 'your_jwt_secret'

const jwt = require('jsonwebtoken'),
    passport = require('passport')
//local passport file
require('./passport.js')

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //This is the username encoding in the JWT
        expiresIn: '7d', //Time limit of token
        algorithm: 'HS256' // Algorithm used to "sign" or encode the values of the JWT
    })
}

/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if(error || !user) {
                return res.status(400).json({
                    message: 'Something is not right!',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if(error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
};

