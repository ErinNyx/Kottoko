const User = require('./assets/models/User.js');
const jwt = require('jsonwebtoken');
const TOKEN = 'jbegnjug$^&*&*^()(*rjunuriojh23r89HE8*(%HNOn*&^oUOBbu99Bbu989BBU9ih@#$(*';
const XSS = require('./XSSProtections.js');

// Set will take a token to verify a user against and it will take a settings obj? arr?
// From there, it iterates over settings and will apply XSSProtections
// Finally, it will update the user document in the DB

const set = async (token, settings) => {
    try {
        let user = jwt.verify(token, TOKEN);

        for (var i in settings) {
            if (!settings[i]) continue;

            if(i == 'pronouns' && settings[i].length > 12) settings[i] = 'Ask me for my pronouns';
            
            settings[i] = XSS.styleFilter(XSS.BBCode(XSS.filter(settings[i])));

            await User.updateOne({ usertag: user.usertag }, {
                $set: { [i]: settings[i] }
            });
        }

        return ({ err: false });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    set
}