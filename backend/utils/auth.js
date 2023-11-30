// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, Membership, Venue, Event } = require('../db/models');

const { secret, expiresIn } = jwtConfig;


// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
  };


const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

// If there is no current user, return an error, authenticate
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  }

// Check to see that current user is the organizer of the target group

const groupAuthorize = async function (req, res, next) {
  const { user } = req;

  let group;

  let status;


  const groupId = parseInt(req.params.groupId);



  if(groupId) {

    group = await Group.findByPk(groupId);

    status = await Membership.findOne({
       where: {
         userId: user.id,
         groupId: groupId
       }
     })
  }

if(group) {

    if(user.id == group.organizerId) {
      return next();
    }
    else if(status) {
       if(status.status === 'co-host') {
        return next()
      }
    }
    else {
      const err = new Error('Forbidden');
      err.title = 'Require proper authorization'
      err.status = 403;
      err.errors = { message: 'Require proper authorization'};
      return next(err);
    }
}
}

const venueAuthorize = async function (req, res, next) {
  const { user } = req;

  let venue;

  let venueGroup;

  const venueId = parseInt(req.params.venueId);

  if(venueId){
    venue = await Venue.findByPk(venueId);

    venueGroup = await Group.findByPk(venue.groupId);
 }

 if(venueGroup) {
  if (venueGroup.organizerId === user.id) {
    return next();
  }
  else {
    const err = new Error('Forbidden');
    err.title = 'Require proper authorization'
    err.status = 403;
    err.errors = { message: 'Require proper authorization'};
    return next(err);
  }
}
}

const eventAuthorize = async function (req, res, next) {

  const { user } = req;

  let event;

  let attendance;

  const eventId = parseInt(req.params.eventId);

  if(eventId) {
    event = await Event.findByPk(eventId);
  }

  if(event) {

    attendance = await event.getUsers({
      where: {
        id: user.id
      }
    })
    if(req.method === 'POST') {
      // console.log(req.method, "ASASASASA");


      if(attendance.length) {
        return next();
      } else {
        const err = new Error('Forbidden');
        err.title = 'Require proper authorization'
        err.status = 403;
        err.errors = { message: 'Require proper authorization'};
        return next(err);
      }
    }
   else if(req.method === 'PUT' || req.method === 'DELETE') {
    let group = await event.getGroup();

    let memberships = await Membership.findOne({
      where: {
        userId: user.id,
        groupId: group.id,
        status: 'co-host'
      }
    })

    // console.log(memberships);

    if(memberships || group.organizerId === user.id) {

        return next();
    }  else {
      const err = new Error('Forbidden');
      err.title = 'Require proper authorization'
      err.status = 403;
      err.errors = { message: 'Require proper authorization'};
      return next(err);
    }
    }
  }
}



const checkId = async function (req, res, next) {

  try{
    const id = parseInt(req.params.groupId);

    const group = await Group.findByPk(id);

    if(group){

      return next();
    } else {
      throw new Error()
    }

  } catch(err) {

     res.status(404)
     return res.json({
        message: "Group couldn't be found"
     })
  }
}

const checkVenueId = async function (req, res, next) {

  try {

    let id = req.params.venueId || req.body.venueId;
    console.log("================");

    id = parseInt(id);


    const venue = await Venue.findByPk(id);

    if(venue) {
      return next()
    } else {
      throw new Error();
    }
  } catch(err) {

    res.status(404)
    return res.json({
       message: "Venue couldn't be found"
    })
 }
}

const checkEventId = async function (req, res, next) {
  try {

    const id = parseInt(req.params.eventId);

    const event = await Event.findByPk(id);

    if(event) {
      return next()
    } else {
      throw new Error();
    }
  } catch(err) {

    res.status(404)
    return res.json({
       message: "Event couldn't be found"
    })
 }
}

module.exports = { setTokenCookie, restoreUser, requireAuth, groupAuthorize, venueAuthorize, eventAuthorize, checkId, checkVenueId, checkEventId };
