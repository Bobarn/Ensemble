// backend/routes/api/membership.js
const express = require('express');

const { setTokenCookie, requireAuth, eventAuthorize, checkEventId, checkVenueId } = require('../../utils/auth');
const { Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



module.exports = router;
