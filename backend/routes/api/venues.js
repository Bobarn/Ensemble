// backend/routes/api/groups.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorize } = require('../../utils/auth');
const { Group, Membership, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

module.exports = router;
