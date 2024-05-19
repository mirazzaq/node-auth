const express = require('express');
const { registerUser, signInUser, refreshToken } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/sign-up', registerUser);
router.post('/sign-in', signInUser);
router.post('/refresh-token', refreshToken);

module.exports = router;