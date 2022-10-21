const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./assets/models/User.js');

const TOKEN = 'jbegnjug$^&*&*^()(*rjunuriojh23r89HE8*(%HNOn*&^oUOBbu99Bbu989BBU9ih@#$(*';

// Will verify user info and return user token
const log = async (usertag, password) => {
    try {
        usertag = usertag.toLowerCase();
        const user = await User.findOne({ usertag });

        var token, avatar;

        if (!user) return ({ message: 'Invalid user tag' });
        if (user.avatar == null) avatar = false;

        //if(!user.auth) return ({ message: 'Email not authenticated' });
        if (await bcrypt.compare(password, user.password)) token = 
            jwt.sign({ id: user._id, usertag: user.usertag, username: user.username, avatar }, TOKEN)
        else return ({ message: 'Invalid password' });
        return ({ token, message: false });

    } catch (err) {
        console.log(err);
        return ({ message: 'Something went horribly wrong. If the issue persists after reload, please contact the webmaster @ erindanytenyx@gmail.com' });
    }
}

module.exports = {
    log
}