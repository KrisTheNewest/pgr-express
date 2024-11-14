const express = require('express');
const router = express.Router();

// Redirecting to the costumes route (leaving out the index route for future)
router.get('/', (req, res) => {
  res.redirect(301, "./costumes");
});

module.exports = router;
