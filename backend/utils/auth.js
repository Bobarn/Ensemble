// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, Membership, Venue } = require('../db/models');

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

const authorize = async function (req, res, next) {
  const { user } = req;

  let group;

  let venue;

  let status;

  let venueGroup;

  const groupId = parseInt(req.params.groupId);

  const venueId = parseInt(req.params.venueId);

  if(groupId) {

    group = await Group.findByPk(groupId);

    status = await Membership.findOne({
       where: {
         userId: user.id,
         groupId: groupId
       }
     })
  } else {
     venue = await Venue.findByPk(venueId);

     venueGroup = await Group.findByPk(venue.groupId);
  }




  // console.log("===============", status.status);

  // console.log(user);
if(group) {

    if(user.id == group.organizerId || status.status === 'co-host') {
      return next();
    }
    else {
      const err = new Error('Forbidden');
      err.title = 'Require proper authorization'
      err.status = 403;
      err.errors = { message: 'Require proper authorization'};
      return next(err);
    }
} else if(venueGroup) {
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

const checkId = async function (req, res, next) {
  const id = parseInt(req.params.groupId);

  const group = await Group.findByPk(id);

  if(!group) {
     res.status(404)
     return res.json({
        message: "Group couldn't be found"
     })
  } else {
     return next()
  }
}

module.exports = { setTokenCookie, restoreUser, requireAuth, authorize, checkId };
