const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport"); // for protected routes

//load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");
//load Profile model
const Profile = require("../../models/Profile");
// load User profile model
const User = require("../../models/User");

// @route           GET api/profiles/test
// @descriptions    tests profiles route
// @access Public   route
router.get("/test", (req, res) => res.json({ msg: "Profiles works" })); // will output json

// @route           GET api/profiles
// @descriptions    get current users profile
// @access          Private route
// note: using jwt strategy we created in config file
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {}; //initialize variable called errors and set it to an empty string to use when calling errors

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])// populate form user, name and avatar
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user"; // after log in this will appear if you have not set up your profile. user will be prompted to do so with buttons
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(errors => res.status(404).json(errors)); // send along error
  }
); // our protected route

// @route           GET api/profiles/all
// @descriptions    get all profiles
// @access          Public route
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});


// @route           GET api/profiles/handle/:handle (backend api route hit by frontend)
// @descriptions    get profile by handle
// @access          Public route
router.get('/handle/:handle', (req, res)=> {
    const errors = {};
    Profile.findOne({handle: req.params.handle})
    .populate('users', ['name', 'avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile) //if is does exist returns 200 and the profile
    })
    .catch(error => res.status(404).json(error));
});

// @route           GET api/profiles/user/:user_id
// @descriptions    get profile by user id
// @access          Public route
router.get('/user/:user_id', (req, res)=> {
    const errors = {}; //
    Profile.findOne({user: req.params.user_id})
    .populate('users', ['name', 'avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile) //if is does exist returns 200 and the profile
    })
    .catch(error => res.status(404).json({profile: "There is no profile for this user"}));
});



// @route           Post api/profiles
// @descriptions    Create or edit user profile
// @access          Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //Check Validation
    if (!isValid) {
      //return any errors with 400 status
      return res.status(400).json(errors);
    }

    //get fields
    const profileFields = {}; //fill this with info from form
    profileFields.user = req.user.id; //logged in user: include avatar, name, email
    if (req.body.handle) profileFields.handle = req.body.handle; //checking to see if this was sent in form the form hand if so set it to profileFields.handle
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //Skills- are split into an array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(","); // give array of skills to put in database instead of comma separated values
    }
    //Social (optional fields)
    profileFields.social = {}; //initialize social and set to empty object
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube; //if it comes in as r.b.youtube if exist then set pf.social.youtube = to r.b.youtube value
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    // Create or Edit current user profile with unique handle
    Profile.findOne({ user: req.user.id }).then(profile => {
      // If profile not exist, then create a new one, Otherwise just update

      // Create new profile
      if (!profile) {
        // Check if handle exists (handle should be unique for all profile)
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "handle already exists";
            res.status(400).json(errors);
          }
        });
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
      // Update the profile
      else {
        // Check if handle exists for other user
        Profile.findOne({ handle: profileFields.handle }).then(p => {
          if (profile.handle !== p.handle) {
            errors.handle = "handle already exists";
            res.status(400).json(errors);
          }
        });
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      }
    });
  }
); // our protected route

// @route           GET api/profiles/experience
// @descriptions    add experience to profile
// @access          Private route
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res)=>{
    const { errors, isValid } = validateExperienceInput(req.body);

    //Check Validation
    if (!isValid) {
      //return any errors with 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
    .then(profile =>{
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        //add to experience array
        profile.experience.unshift(newExp);// unshift adds it to the beginning of the array

        profile.save().then(profile => res.json(profile));
    })
});


// @route           GET api/profiles/education
// @descriptions    add education to profile
// @access          Private route
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res)=>{
    const { errors, isValid } = validateEducationInput(req.body);

    //Check Validation
    if (!isValid) {
      //return any errors with 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
    .then(profile =>{
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        //add to experience array
        profile.education.unshift(newEdu);// unshift adds it to the beginning of the array

        profile.save().then(profile => res.json(profile));
    })
});

// @route           DELETE api/profiles/experience/:exp_id
// @descriptions    delate experience from profile
// @access          Private route
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)// map an array to item id
          .indexOf(req.params.exp_id); //match passed in value 

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(error => res.status(404).json(error));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({user: req.user.id})
    .then(()=>{
      User.findOneAndRemove({_id: req.user.id})
      .then(()=> res.json({ success: true }));
    })
  }
);



module.exports = router;
