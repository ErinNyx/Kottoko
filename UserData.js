const User = require('./assets/models/User.js');
async function grabData(id, requester) {
    var usertag, avatar, username, messages, admin, notebook, lesson, dictionary, chatrooms, profile, pronouns, joined;

    var user1 = await User.findOne({ usertag: id }).lean();
    if(requester) var user2 = await User.findOne({ usertag: requester.usertag }).lean();

    if (!user1 && !user2) return ({ err: true });

    if (user2 && (user1.usertag == user2.usertag || user2.admin)) {
        messages = user1.messages;
        notebook = user1.notebook;
        lesson = user1.lesson;
        dictionary = user1.dictionary;
        chatrooms = user1.chatrooms
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

const data = (id, token) => {
    var json = false;
    if(token) json = JSON.parse(atob(token.split('.')[1]));
    return grabData(id, json);
}

module.exports = {
    data
}