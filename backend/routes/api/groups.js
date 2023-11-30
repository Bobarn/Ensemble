// backend/routes/api/groups.js
const express = require('express');

const { setTokenCookie, requireAuth, groupAuthorize, checkId } = require('../../utils/auth');
const { Group, GroupImage, Venue, Event } = require('../../db/models');
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

 const validateVenuePost = [
   check('address')
     .exists({ checkFalsy: true })
     .isString()
     .withMessage('Street address is required'),
   check('city')
      .exists({ checkFalsy: true })
      .isString()
      .isAlpha('en-US', {ignore: [' ', '-']})
      .withMessage('City is required'),
   check('state')
     .exists({ checkFalsy: true })
     .isString()
     .isAlpha('en-US', {ignore: [' ', '-']})
     .withMessage('State is required'),
   check('lat')
     .exists({checkNull: true})
     .isFloat({min: -90, max: 90})
     .withMessage('Latitude is not valid'),
   check('lng')
     .exists({checkNull: true})
     .isFloat({min: -180, max: 180})
     .withMessage('Longitude is not valid'),
   handleValidationErrors
 ];

const validateEventPost = [
   check('venueId')
      .exists()
      .isInt()
      .withMessage('Venue does not exist'),
   check('name')
      .exists()
      .isLength({ min: 5 })
      .withMessage('Name must be 60 characters or less'),
   check('type')
      .exists()
      .isIn(['Online', 'In person'])
      .withMessage('Type must be "Online" or "In person"'),
   check('capacity')
      .exists()
      .isInt({min: 1})
      .withMessage('Capacity must be an integer'),
   check('price')
      .exists()
      .isFloat()
      .custom((value) => {
         value = value.toFixed(2);
         console.log(value);
         if(value.toString().split('.')[1].length > 2) {
            throw new Error("Price is invalid")
         }
         return true
      })
      .withMessage('Price is invalid'),
   check('description')
      .exists()
      .isAlpha('en-US', {ignore: [' ', '-', '!', '.', '?', "'", '"', '(', ')']})
      .withMessage('Description is required'),
   check('startDate')
      .exists()
      .toDate()
      .custom(value=>{
         let enteredDate=new Date(value);
         let todaysDate=new Date();
         if(enteredDate < todaysDate){
             throw new Error("Start date must be in the future");
         }
         return true;
     })
      .withMessage('Start date must be in the future'),
   check('endDate')
      .exists()
      .toDate()
      .custom((endDate, { req }) => {
         if (endDate.getTime() < req.body.startDate.getTime()) {
             throw new Error('End date is less than start date');
         }
         return true
     })
      .withMessage('End date is less than start date'),
handleValidationErrors
]

router.get('/', async (req, res) => {
 const groups = await Group.findAll();

 const groupsInfo = []


 for(let group of groups) {
    let members = await group.getMembers();
    let previewImage = await group.getGroupImages({
      where: {
         preview: true
      }
    });

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

router.get('/:groupId', checkId, async (req, res) => {
   const id = parseInt(req.params.groupId);

   const group = await Group.findByPk(id);


   const organizer = await group.getUser({
      attributes: ['id', 'firstName', 'lastName']
   })

   const venues = await group.getVenues();

   const images = await group.getGroupImages();

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

router.post('/:groupId/images', checkId, requireAuth, groupAuthorize, async (req, res) => {

   const id = parseInt(req.params.groupId);

   const { user } = req;

   const { url, preview } = req.body;

   let image = {};

   let result

   image.url = url;

   image.preview = preview;

   const group = await Group.findByPk(id);


      image = await group.createGroupImage(image);

      result = await GroupImage.findOne({
         where: {
            id: image.id
         }
      })

   res.json(result)
})

router.put('/:groupId', checkId, requireAuth, groupAuthorize, validateGroupEdit, async (req, res) => {
   const id = parseInt(req.params.groupId);

   const { name, about, type, private, city, state } = req.body;

   const group = await Group.findByPk(id);

   group.name = name || group.name;

   group.about = about || group.about;

   group.type = type || group.type;

   group.private = private !== undefined ? private : group.private;

   group.city = city || group.city;

   group.state = state || group.state;

   await group.save();

   return res.json(group);
})

router.delete('/:groupId', checkId, requireAuth, groupAuthorize, async (req, res) => {

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

router.get('/:groupId/venues', checkId, requireAuth, groupAuthorize, async (req, res) => {

   const groupId = parseInt(req.params.groupId);

   const group = await Group.findByPk(groupId);

   const venues = await group.getVenues();

   return res.json({Venues: venues});
})

router.post('/:groupId/venues', checkId, requireAuth, groupAuthorize, validateVenuePost, async (req, res) => {

   const groupId = parseInt(req.params.groupId);

   const group = await Group.findByPk(groupId);

   const { address, city, state, lat, lng } = req.body;

   let venue = await group.createVenue({
      address,
      city,
      state,
      lat,
      lng
   })

   return res.json(venue);
});

router.get('/:groupId/events', checkId, async (req, res) => {

   const groupId = parseInt(req.params.groupId);

   const group = await Group.findByPk(groupId);

   let Events = [];

   let associated = await group.getEvents({
      include: [{
          model: Group,
          attributes: ['id', 'name', 'city', 'state']
      }, {
          model: Venue,
          attributes: ['id', 'city', 'state']
      }]
  });

//   console.log(associated);

   for(let event of associated) {
      let attendees = await event.getUsers();

      let numAttending = attendees.length;

      let previewImage = await event.getEventImages({
          where: {
              preview: true
          }
      });

      event = event.toJSON();

      event.numAttending = numAttending;

      event.previewImage = previewImage[0].url;

      Events.push(event);
   }

   return res.json({
      Events
   })
})

router.post('/:groupId/events', checkId, validateEventPost, requireAuth, groupAuthorize, async (req, res) => {

   const groupId = parseInt(req.params.groupId);

   const group = await Group.findByPk(groupId);

   const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

   const venue = await Venue.findByPk(parseInt(venueId));
   if(!venue) {
      res.status(400);
      res.json({
         message: 'Bad Request',
         errors: {
            venueId: "Venue does not exist"
         }
      })
   }

   let event = {groupId, venueId, name, type, capacity, price, description, startDate, endDate};

   event = await Event.create(event);

   event = await Event.scope('specific').findByPk(event.id);

   return res.json(event);
})


module.exports = router;
