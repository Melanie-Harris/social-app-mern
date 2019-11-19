const express = require('express');
const router = express.Router();

// @route GET api/posts/test
// @descriptions tests post route
// @access Public route
router.get('/test', (req, res) => res.json({ msg: "Posts works" }));// will output json

module.exports = router;