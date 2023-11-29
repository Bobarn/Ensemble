// backend/routes/api/events.js
const express = require('express');

const { setTokenCookie, requireAuth, authorize, checkEventId } = require('../../utils/auth');
const { Event, Venue, Group } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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

        event.previewImage = previewImage[0].url;

        allEvents.push(event);
    }


    res.json({
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

    res.json(event)
})


module.exports = router;
