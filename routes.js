const express = require('express');

const router = express.Router();

const index_urls = require('./routes/index');
const users_urls = require('./routes/users');
const games_urls = require('./routes/games');
const events_urls = require('./routes/events');

// API routes
router.use('', index_urls);
router.use('/users', users_urls);
router.use('/games', games_urls);
router.use('/events', events_urls);

module.exports = router;