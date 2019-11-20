const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');// from User.js model
const keys = require('../config/keys');//bring in secrete with request, it needs to be validated

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {// passport from server.js
    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        // console.log(jwt_payload)
        User.findById(jwt_payload.id)
        .then(user =>{
            if(user){
              return done(null, user)  //if user has been found, return error(null) and user
            }
            return done(null, false) // if user isn't found, return error (null) and false b/c there is no user
        })
        .catch(error => console.log(error));
    }));
}