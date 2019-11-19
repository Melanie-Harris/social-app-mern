const express = require('express');
const router = express.Router();

// @route GET api/profiles/test
// @descriptions tests profiles route
// @access Public route
router.get('/test', (req, res) => res.json({ msg: "Profiles works" }));// will output json

module.exports = router;