const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt')

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt

//uses basic HTTP auth for login req
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, async (username, password, callback) => {
    try {
        const user = await Users.findOne({ Username: username });
        if (!user) {
            return callback(null, false, { message: 'Incorrect username or password.' });
        }
        return callback(null, user);
    } catch (error) {
        return callback(error);
    }
}))

// JWT auth 
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user)
        })
        .catch((error) => {
            return callback(error)
        })
}))