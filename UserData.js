const User = require('./assets/models/User.js');
const jwt = require('jsonwebtoken');
const TOKEN = 'jbegnjug$^&*&*^()(*rjunuriojh23r89HE8*(%HNOn*&^oUOBbu99Bbu989BBU9ih@#$(*';
/**
 * grabData takes the id and requester id of a user and will grab the data depending on the requester
 * If the requester IS the person being requested, it will return sensitive info like messages and user
 * specific stuff
 * @param {*} id 
 * @param {*} requester 
 * @returns 
 */
async function grabData(id, requester) {
    var usertag, avatar, username,
        messages, admin, notebook,
        lesson, dictionary, chatrooms,
        profile, pronouns, joined, unread;

    try {
        var user1 = await User.findOne({ usertag: id }).lean();
        if (requester) var user2 = await User.findOne({ usertag: requester.usertag }).lean();
    } catch (err) {
        return ({ err: true });
    }

    if (!user1 && !user2) return ({ err: true });
    if (!user1) return ({ err: true });

    if (user2 && (user1.usertag == user2.usertag || user2.admin)) {
        messages = user1.messages;
        notebook = user1.notebook;
        lesson = user1.lesson;
        dictionary = user1.dictionary;
        chatrooms = user1.chatrooms;
        unread = user1.unread;
    }

    usertag = user1.usertag;
    avatar = user1.avatar;
    username = user1.username;
    profile = user1.profile;
    pronouns = user1.pronouns;
    joined = user1.joined;
    admin = user1.admin;

    return ({
        err: false, usertag, avatar, username, messages, admin, notebook,
        lesson, dictionary, chatrooms, profile, pronouns, joined
    });
}

/**
 * jwt.verify will check the user token against the encryption value token to return user data. 
 * This makes sure that the user is who they claim they are
 * @param {*} id 
 * @param {*} token 
 * @returns 
 */
const data = (id, token) => {
    var json = false;
    if (token) json = jwt.verify(token, TOKEN);
    return grabData(id, json);
}

module.exports = {
    data
}