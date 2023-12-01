// backend/routes/api/events.js
const express = require('express');

const { setTokenCookie, requireAuth, eventAuthorize, checkEventId, checkVenueId } = require('../../utils/auth');
const { Event, Venue, Group, EventImage, Membership, Attendance, User } = require('../../db/models');
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

router.post('/:eventId/images', requireAuth, checkEventId, async (req, res) => {

    const { user } = req;


    const { url, preview} = req.body;

    const eventId = parseInt(req.params.eventId);

    let attendance = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: user.id,
            status: 'attending'
        }
    })

    let event = await Event.findByPk(eventId)

    let group = await Group.findByPk(event.groupId);

        let membership = await Membership.findOne({
            where: {
                groupId: event.groupId,
                userId: user.id,
                status: 'co-host'
            }
        })

    if(attendance || membership || group.organizerId == user.id) {


    let image = {url, preview}

    let newImage = await event.createEventImage(image)

    image = await EventImage.findByPk(newImage.id, {
        attributes: {
            exclude: ['eventId']
        }
    });

    return res.json(image);

    } else {
        const err = new Error('Forbidden');
        err.title = 'Require proper authorization'
        err.status = 403;
        err.errors = { message: 'Require proper authorization'};
        return res.json(err);
    }
})

router.put('/:eventId', requireAuth, checkEventId, checkVenueId, validateEventPut, eventAuthorize, async (req, res) => {

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

router.delete('/:eventId', requireAuth, checkEventId, eventAuthorize, async (req, res) => {

    let eventId = req.params.eventId;

    // console.log('==============',eventId);

    eventId = parseInt(eventId);

    const event = await Event.findByPk(eventId);

    await event.destroy()

    return res.json({
        "message": "Successfully deleted"
    })
})

router.get('/:eventId/attendees', checkEventId, async (req, res) => {

    const { user } = req;

    let attendees;

    let result = [];

    let event = await Event.findByPk(parseInt(req.params.eventId));

    let groupId = event.groupId;

    const group = await Group.findByPk(groupId);

    let cohosts = await Membership.findOne({
       where: {
          userId: user.id,
          groupId: group.id,
          status: 'co-host'
       }
    })

    if(group.organizerId === user.id || cohosts) {
       attendees = await event.getUsers({
          attributes: {
             exclude: ['username']
          },
          through: ['status']
       })

       return res.json({
          Attendees: attendees
       })

    } else {
       attendees = await event.getUsers({
          attributes: {
             exclude: ['username']
          },
          through: ['status']
       })
       for(let attendee of attendees) {

          if(attendee.Attendance.status !== 'pending') {
             result.push(attendee);
          }
       }
       return res.json({
          Attendees: result
       });
    }
})

router.post('/:eventId/attendance', checkEventId, async (req, res, next) => {
    const { user } = req;

    const eventId = parseInt(req.params.eventId);

    let event = await Event.findByPk(eventId);

    let groupId = event.groupId;

    let membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    });

    if(!membership) {
        const err = new Error('Forbidden');
        err.title = 'Require proper authorization'
        err.status = 403;
        err.errors = { message: 'Require proper authorization'};
        return next(err);
    } else {

        await Attendance.create({
            userId: user.id,
            eventId: eventId,
            status: 'pending'
        })

        return res.json({
            userId: user.id,
            status: 'pending'
        })
    }

})

router.put('/:eventId/attendance', requireAuth, checkEventId, eventAuthorize, async (req, res, next) => {

    const { user } = req;

    const eventId = parseInt(req.params.eventId);

    let event = await Event.findByPk(eventId);

    let groupId = event.groupId;

    const { userId, status } = req.body;

    let attendanceUser = await User.findByPk(userId);

    let attendance = await Attendance.scope('specific').findOne({
       where: {
          userId: userId,
          eventId: eventId
       }
    })

    if(!attendanceUser) {

       res.status(400);

       return res.json(    {
          "message": "Validation Error",
          "errors": {
            "userId": "User couldn't be found"
          }
       });

    } else if (!attendance) {
       res.status(404);

       return res.json( {
          "message": "Attendance between the user and the event does not exist"
        });
    }


    let group = await Group.findByPk(groupId);

    let organizer = group.organizerId;

    let membership = await Membership.findOne({
       where: {
         userId: user.id,
         groupId: groupId,
         status: 'co-host'
       }
     });

     if(status === 'pending') {
       res.status(400);

       return res.json( {
          "message": "Validations Error",
          "errors": {
            "status" : "Cannot change an attendance status to pending"
          }
        })
     }

     if((organizer == user.id || membership)) {
       attendance.status = status;

     } else {
        const err = new Error('Forbidden');
        err.title = 'Require proper authorization'
        err.status = 403;
        err.errors = { message: 'Require proper authorization'};
        return next(err);
     }
     await attendance.save();
     res.json({
       id: attendance.id,
       groupId: groupId,
       memberId: attendance.userId,
       status: attendance.status
     });
})

router.delete('/:eventId/attendance', requireAuth, checkEventId, async (req, res) => {
    const { user } = req;

    const eventId = parseInt(req.params.eventId);

    const { userId } = req.body;

    let event = await Event.findByPk(eventId, {
        include: {
            model: Group
        }
    })


    let organizerId = event.Group.organizerId;

    let attendance = await Attendance.scope('specific').findOne({
        where: {
            eventId: eventId,
            userId: userId
        }
    })

    if(!attendance) {
        res.status(404);

        return res.json( {
           "message": "Attendance does not exist for this user"
         });
    }

    if(userId == user.id || user.id == organizerId) {
        await attendance.destroy();

        return res.json( {
            "message": "Successfully deleted attendance from event"
          })
    }
})

module.exports = router;
