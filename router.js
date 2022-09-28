//const fs = require('fs');

//Grab title of webpage and return js file, css file
//Perhaps not the most elegant solution but fs was being dumb
//I refuse to accept that I'm the one messing up here
const route = (path) => {
    const outputPath = {
        '': 'main.js main.css',
        'login': 'login.js login.css',
        'register': 'register.js register.css',
        'user': 'profile.js profile.css',
        'messages': 'message.js message.css'
    }

    var req = path.split('/');
    req = req[1];
    req.trim();

    if(outputPath[req]) return outputPath[req];
    else return false;
}

module.exports = {
    route
}