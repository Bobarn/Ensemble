// backend/routes/api/groups.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorize } = require('../../utils/auth');
const { Group, Membership, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateGroupPost = [
   check('name')
     .exists({ checkFalsy: true })
     .isLength({ max: 60 })
     .withMessage('Name must be 60 characters or less'),
   check('about')
     .exists({ checkFalsy: true })
     .isLength({ min: 50 })
     .withMessage('About must be 50 characters or more'),
   check('type')
     .isIn(['Online', 'In person'])
     .withMessage('Type must be "Online" or "In person"'),
   check('private')
     .exists()
     .isBoolean()
     .withMessage('Private must be a boolean'),
   check('city')
     .exists({checkFalsy: true})
     .isAlpha('en-US', {ignore: [' ', '-']})
     .withMessage('City is required'),
   check('state')
     .exists({checkFalsy: true})
     .isAlpha('en-US', {ignore: '-'})
     .withMessage('State is required'),
   handleValidationErrors
 ];

 const validateGroupEdit = [
   check('name')
      .optional()
     .isLength({ max: 60 })
     .withMessage('Name must be 60 characters or less'),
   check('about')
      .optional()
     .isLength({ min: 50 })
     .withMessage('About must be 50 characters or more'),
   check('type')
      .optional()
     .isIn(['Online', 'In person'])
     .withMessage('Type must be "Online" or "In person"'),
   check('private')
      .optional()
     .isBoolean()
     .withMessage('Private must be a boolean'),
   check('city')
      .optional()
      .isAlpha('en-US', {ignore: [' ', '-']})
     .withMessage('City is required'),
   check('state')
      .optional()
      .isAlpha('en-US', {ignore: [' ', '-']})
     .withMessage('State is required'),
   handleValidationErrors
 ];

router.get('/', async (req, res) => {
 const groups = await Group.findAll();

 const groupsInfo = []


 for(let group of groups) {
    let members = await group.getMembers();
    let previewImage = await group.getGroupImages();


    let numMembers = members.length;

    group = group.toJSON()

    group.numMembers = numMembers;


    group.previewImage = previewImage[0].url;

    groupsInfo.push(group);
 }

 res.json({
    Groups: groupsInfo
 })
})

router.get('/current', async (req, res) => {
 const { user } = req;

 let groups
 let groupsInfo = [];

 if(user) {
   groups = await user.getOrgs();

   // console.log(groups);


   for(let group of groups) {
      let members = await group.getMembers();
      let previewImage = await group.getGroupImages();

      let numMembers = members.length;

      group = group.toJSON()

      group.numMembers = numMembers;

      group.previewImage = previewImage[0].url;

      delete group.Membership

      groupsInfo.push(group);
   }

}
   res.json({
      Groups: groupsInfo
   });
})

router.get('/:groupId', async (req, res) => {
   const id = parseInt(req.params.groupId);



   const group = await Group.findByPk(id);

   if(!group) {
      res.status(404)
      res.json({
         message: "Group couldn't be found"
      })
   }

   const organizer = await group.getUser({
      attributes: ['id', 'firstName', 'lastName']
   })

   const venues = await group.getVenues({
      attributes: {
         exclude: ['createdAt', 'updatedAt']
      }
   });

   const images = await group.getGroupImages({
      attributes: {
         exclude: ['createdAt', 'updatedAt', 'groupId']
      }
   });

   res.json({
      ...group.dataValues,
      GroupImages: images,
      Organizer: organizer,
      Venues: venues
   })
})


router.post('/', requireAuth, validateGroupPost, async (req, res) => {

   const { user } = req;

   const { name, about, type, private, city, state } = req.body;

   const newGroup = {}

   newGroup.name = name;

   newGroup.about = about;

   newGroup.type = type;

   newGroup.private = private;

   newGroup.city = city;

   newGroup.state = state;

   newGroup.organizerId = user.id

   const add = await Group.create(newGroup)

   res.status(201)

   res.json(add);

})

router.post('/:groupId/images', requireAuth, authorize, async (req, res) => {

   const id = parseInt(req.params.groupId);

   const { user } = req;

   const { url, preview } = req.body;

   let image = {};

   let result

   image.url = url;

   image.preview = preview;

   const group = await Group.findByPk(id);

   if(!group) {
      return res.json({
         message: "Group couldn't be found"
      })
   }

   // if(user.id === group.organizerId) {
      image = await group.createGroupImage(image);

      result = await GroupImage.findOne({
         where: {
            id: image.id
         },
         attributes: {
            exclude: ['createdAt', 'updatedAt', 'groupId']
         }
      })
   // }

   res.json(result)
})

router.put('/:groupId', requireAuth, authorize, validateGroupEdit, async (req, res) => {
   const id = parseInt(req.params.groupId);

   const { name, about, type, private, city, state } = req.body;

   const group = await Group.findByPk(id);

   if(!group) {
      return res.json({
         message: "Group couldn't be found"
      })
   }

   group.name = name || group.name;

   group.about = about || group.about;

   group.type = type || group.type;

   group.private = private !== undefined ? private : group.private;

   group.city = city || group.city;

   group.state = state || group.state;

   await group.save();

   res.json(group);
})

router.delete('/:deleteId', requireAuth, authorize, async (req, res) => {

   const id = parseInt(req.params.groupId);

   const group = await Group.findByPk(id);

   if(!group) {
      res.status(404)
      return res.json({
         message: "Group couldn't be found"
      })
   }

   await group.destroy();

   return res.json({ message: 'Successfully deleted'})
})

module.exports = router;
