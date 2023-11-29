// backend/routes/api/groups.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorize, checkVenueId } = require('../../utils/auth');
const { Venue } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateVenueEdit = [
    check('address')
      .optional()
      .isString()
      .withMessage('Street address is required'),
    check('city')
       .optional()
       .isString()
       .isAlpha('en-US', {ignore: [' ', '-']})
       .withMessage('City is required'),
    check('state')
      .optional()
      .isString()
      .isAlpha('en-US', {ignore: [' ', '-']})
      .withMessage('State is required'),
    check('lat')
      .optional()
      .isFloat({min: -90, max: 90})
      .withMessage('Latitude is not valid'),
    check('lng')
      .optional()
      .isFloat({min: -180, max: 180})
      .withMessage('Longitude is not valid'),
    handleValidationErrors
  ];

router.put('/:venueId', checkVenueId, requireAuth, authorize, validateVenueEdit, async (req, res) => {



    const id = parseInt(req.params.venueId);

    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(id);

    venue.address = address || venue.address;

    venue.city = city || venue.city;

    venue.state = state || venue.state;

    venue.lat = lat !== undefined ? lat : venue.lat;

    venue.lng = lng !== undefined ? lng : venue.lng;

    await venue.save();

    const result = await Venue.findByPk(id);

    res.json(result)

})

module.exports = router;
