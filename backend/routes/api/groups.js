// backend/routes/api/groups.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res) => {
 const groups = await Group.findAll();


 for(let group of groups) {
    let members = await group.getUsers();
    let numMembers = members.length;

    group.dataValues.numMembers = numMembers;

    // console.log(group);

    let previewImage = await group.getGroupImages();

    group.dataValues.previewImage = previewImage[0].url;
 }

 res.json({
    Groups: groups
 })
})

router.get('/:id', async (req, res) => {

})

module.exports = router;
