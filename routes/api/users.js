const express = require('express');
const router = express.Router();


// @route GET api/users/test
// @descriptions tests users route
// @access Public route
router.get('/test', (req, res) => res.json({msg: "Users works"}));// will output json

module.exports = router;