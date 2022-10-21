const User = require('./assets/models/User.js');
const jwt = require('jsonwebtoken');
const TOKEN = 'jbegnjug$^&*&*^()(*rjunuriojh23r89HE8*(%HNOn*&^oUOBbu99Bbu989BBU9ih@#$(*';
const XSS = require('./XSSProtections.js');

/**
 * Log will check for a room type and will (for right now):
 * Verifies user
 * Gets the user who sent the message
 * Gets the user who was send the message
 * Will then create and push a message object into the db
 * @param {*} to is an object. has a value called usertag that needs to be changed to 'roomTag' and a type that determines
 * what mongodb model to use, either User or, later, Chatrooms 
 * @param {*} from is a user token in base64
 * @param {*} msg is just a string
 * @returns 
 */
const log = async (to, from, msg) => {
    var f, t;
    try {
        //checks if private message or chatroom
        if (to.type == 'pm') {
            //parses out user info
            var user = jwt.verify(from, TOKEN);
            f = await User.findOne({ usertag: user.usertag }).lean();
            t = await User.findOne({ usertag: to.usertag }).lean();

            //if either user is not found, return error
            if (!f || !t) return ({ err: true, message: 'User not found' });

            var msg = {
                from: f.usertag,
                to: t.usertag,
                content: XSS.filter(XSS.BBCode(msg))
            }

            //pushes messages into user object
            await User.updateOne({ usertag: f.usertag }, { $push: { messages: msg } }, { modify: true });
            await User.updateOne({ usertag: t.usertag }, { $push: { messages: msg } }, { modify: true });

            //set unread
            // await User.updateOne({ usertag: t.usertag }, { $push: { unread: f.usertag } }, { modify: true });

            //set as person last talked to
            await User.updateOne({ usertag: f.usertag }, { $set: { lastTalked: t.usertag } }, { modify: true });

            return ({ err: false, msg });
        } else {

        }

    } catch (err) {
        console.log(err);
        //will be handling this better later, just for error testing right now
    }
}

module.exports = {
    log
}