const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post Model
const Post = require("../../models/Post");
//Profile model
const Profile = require("../../models/Profile");

//Validation
const validatePostInput = require("../../validation/post");

// @route           GET api/posts/test
// @descriptions    tests post route
// @access          Public route
router.get("/test", (req, res) => res.json({ msg: "Posts works" })); // will output json

// @route   GET api/posts
// @desc    Get post
// @access  Public
router.get('/', (req,res) =>{
    Post.find()
    .sort({date: -1})// sort by day
    .then(posts => res.json(posts))
    .catch(error => res.status(404).json({nopostsfound: 'No posts found'}));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ nopostfound: 'No post found with that ID' })
      }
    })
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});


// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts.:id
// @desc    delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res)=> {
    Profile.findOne('')
})

module.exports = router;
