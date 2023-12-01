// backend/routes/api/event-images.js
const express = require('express');

const { setTokenCookie, requireAuth, eventImageAuthorize } = require('../../utils/auth');
const { EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = express.Router();

router.delete('/:imageId', requireAuth, eventImageAuthorize, async (req, res) => {
    const imageId = req.params.imageId;

    let image = await EventImage.findByPk(imageId)

    await image.destroy();

    res.json({
        "message": "Successfully deleted"
      })

})

module.exports = router;
