// backend/routes/api/group-images.js
const express = require('express');

const { setTokenCookie, requireAuth, groupImageAuthorize } = require('../../utils/auth');
const { Group, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = express.Router();

router.delete('/:imageId', requireAuth, groupImageAuthorize, async (req, res) => {
    const imageId = req.params.imageId;

    let image = await GroupImage.findByPk(imageId)

    await image.destroy();

    res.json({
        "message": "Successfully deleted"
      })

})

module.exports = router;
