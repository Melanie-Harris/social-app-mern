const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require("../../validation/login");

//bring in user model
const User = require('../../models/User');


// @route            GET api/users/test
// @descriptions     tests users route
// @access           Public route
router.get('/test', (req, res) => res.json({msg: "Users works"}));// will output json

// @route            POST api/users/register
// @descriptions     Register a user
// @access           Public route
router.post('/register', (req, res)=>{
    const {errors, isValid} = validateRegisterInput(req.body);// everything sent to this route
    if(!isValid){//check for errors (validation)
        return res.status(400).json(errors);
                }

    User.findOne({ email: req.body.email })// looking to see if registration exist already
.then(user => {
    if(user){
        errors.email = 'Email already exists';
        return res.status(400).json({email: "Sorry, that email already exists"});// if there is a user after the request send 400 error (incorrect action) user already exists
    }else{
    const avatar = gravatar.url(req.body.email, {// inserts gravatar user's image if it exist. if it doesn't exist will provide black avatar for users
    s: '200', //size
    r: 'pg', //rating
    d: 'mm' // default
    });

    const newUser = new User({ // creates the new user
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
    });

    bcrypt.genSalt(10, (error, salt)=> {
        bcrypt.hash(newUser.password, salt, (error, hash) => {//newUser is the plain text password
            if(error) throw error;
            newUser.password = hash //set new user password to hash the password
            newUser.save()
            .then(user => res.json(user))// if successful return user
            .catch(error => console.log(error) );// if not successful return the error
        })
    })
    }
})
});

// @route            POST api/users/login
// @descriptions     Login a user/ returning the JWT token
// @access           Public route
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body); // everything sent to this route
    if (!isValid) {
      //check for errors (validation)
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    //find user by email
    User.findOne({email: email})
    .then(user => {//if doesn't match user then it will be fals
    //check for user
    if(!user){
        errors.email = 'email not found';
        return res.status(404).json(errors)// not found
    }
    //Check Passwords match
    bcrypt.compare(password, user.password)// password that user typed in is in plain text, password in database is hashed, so must use bcrypt to compare the two passwords.
    //.compare(password, user) "password" is plain text password, "user.password" is information from user tso hashed password
    .then(isMatch => {// if user passed the above test. used parameter isMatch <-- banana term
        if (isMatch) {// true or false value
            //User Matched
            const payload = {id: user.id, name: user.name, avatar: user.avatar }// Create JWT Payload
            //payload is data being carried within packet or other transmission unit

            //Sign token
            jwt.sign(
                payload, 
                keys.secretOrKey, 
                {expiresIn: 3600}, 
                (error, token)=> {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token //certain type of protocols
                    });            
                })//expiration
        } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
        }
    })
})
});

// @route            GET api/users/current    (grabs current user)
// @descriptions     return current user of who ever the token belongs to
// @access           Private route
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res)=>{
    res.json({// specify info you want returned below
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });// to retrieve user
})//using jwt strategy

module.exports = router;