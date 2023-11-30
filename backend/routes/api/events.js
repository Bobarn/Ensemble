// backend/routes/api/events.js
const express = require('express');

const { setTokenCookie, requireAuth, eventAuthorize, checkEventId, checkVenueId } = require('../../utils/auth');
const { Event, Venue, Group, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateEventPut = [
    check('venueId')
       .optional()
       .isInt()
       .withMessage('Venue does not exist'),
    check('name')
       .optional()
       .isLength({ min: 5 })
       .withMessage('Name must be 60 characters or less'),
    check('type')
       .optional()
       .isIn(['Online', 'In person'])
       .withMessage('Type must be "Online" or "In person"'),
    check('capacity')
       .optional()
       .isInt({min: 1})
       .withMessage('Capacity must be an integer'),
    check('price')
       .optional()
       .isFloat()
       .custom((value) => {
          value = value.toFixed(2);
        //   console.log(value);
          if(value.toString().split('.')[1].length > 2) {
             throw new Error("Price is invalid")
          }
          return true
       })
       .withMessage('Price is invalid'),
    check('description')
       .optional()
       .isAlpha('en-US', {ignore: [' ', '-', '!', '.', '?', "'", '"', '(', ')']})
       .withMessage('Description is required'),
    check('startDate')
       .optional()
       .custom(value=>{
          let enteredDate=new Date(value);
          let todaysDate=new Date();
          if(enteredDate <= todaysDate){
              throw new Error("Start date must be in the future");
          }
          return true;
      })
       .withMessage('Start date must be in the future'),
    check('endDate')
       .optional()
       .custom((endDate, { req }) => {

        let enteredDate=new Date(endDate);
        let startDate=new Date(req.body.startDate);

          if (enteredDate.getTime() < startDate.getTime()) {
              throw new Error('End date is less than start date');
          }
          return true
      })
       .withMessage('End date is less than start date'),
 handleValidationErrors
 ]

router.get('/', async (req, res) => {

    const Events = await Event.findAll({
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        }, {
            model: Venue,
            attributes: ['id', 'city', 'state']
        }]
    });

    let allEvents = []

    for(let event of Events) {
        let attendees = await event.getUsers();

        let numAttending = attendees.length;

        let previewImage = await event.getEventImages({
            where: {
                preview: true
            }
        });

        event = event.toJSON();

        event.numAttending = numAttending;

        if(previewImage.length) {

            event.previewImage = previewImage[0].url;
        }


        allEvents.push(event);
    }


    return res.json({
        Events: allEvents
    });
})

router.get('/:eventId', checkEventId, async (req, res) => {
    const id = parseInt(req.params.eventId);

    let event = await Event.scope('specific').findByPk(id);

    let venue = await event.getVenue({
        attributes: {
            exclude: ['groupId']
        }
    });

    let group = await event.getGroup({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'about', 'type', 'organizerId']
        }
    });

    let attendees = await event.getUsers();

    let numAttending = attendees.length;

    let EventImages = await event.getEventImages({
        attributes: {
            exclude: ['eventId']
        }
    });

    event = event.toJSON();

    event.numAttending = numAttending;

    event.Group = group;

    event.EventImages = EventImages;

    event.Venue = venue;

    return res.json(event)
})

router.post('/:eventId/images', checkEventId, requireAuth, eventAuthorize, async (req, res) => {

    const { url, preview} = req.body;

    const eventId = parseInt(req.params.eventId);

    let event = await Event.findByPk(eventId)

    let image = {url, preview}

    let newImage = await event.createEventImage(image)

    image = await EventImage.findByPk(newImage.id, {
        attributes: {
            exclude: ['eventId']
        }
    });

    return res.json(image);
})

router.put('/:eventId', checkEventId, checkVenueId, validateEventPut, requireAuth, eventAuthorize, async (req, res) => {

    const eventId = parseInt(req.params.eventId);

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    // console.log(startDate);

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

    let event = await Event.findByPk(eventId);

    event.set({ venueId, name, type, capacity, price, description, startDate, endDate });

    event = await event.save();

    newEvent = await Event.scope('specific').findByPk(event.id);

    return res.json(newEvent);
})

router.delete('/:eventId', checkEventId, requireAuth, eventAuthorize, async (req, res) => {

    let eventId = req.params.eventId;

    // console.log('==============',eventId);

    eventId = parseInt(eventId);

    const event = await Event.findByPk(eventId);

    await event.destroy()

    return res.json({
        "message": "Successfully deleted"
    })
})

module.exports = router;
