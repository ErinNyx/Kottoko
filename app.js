/**
 * This app is a Japanese web learning program by which users
 * are given everything they need to success in a (hopefully) thriving
 * community of other Japanese learners/speakers
 * @author Erin Argo
 */

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const TOKEN = 'jbegnjug$^&*&*^()(*rjunuriojh23r89HE8*(%HNOn*&^oUOBbu99Bbu989BBU9ih@#$(*';
const router = require('./router.js');
const register = require('./register.js');
const login = require('./login.js');
const USERDATA = require('./UserData.js');
const message = require('./messaging.js');
const settings = require('./settings.js');

const app = express();
const server = http.createServer(app);
const port = process.env.port || 80;

const { Server } = require('socket.io');
const io = new Server(server);

const ERR_MSG = 'Something went wrong, please contact the webmaster @ erinemrysnyx@gmail.com or send her a dm, user erinnyx';

//geese
mongoose.connect('MONGO DB URL HERE', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//endpoints
app.use(express.static(__dirname + '/assets'));
app.use(favicon(__dirname + "/assets/images/favicon.ico"));
app.use(bodyParser.json());

app.use(
    fileUpload({
        limits: {
            fileSize: 10000000 // Around 10MB
        },
        abortOnLimit: true,
    })
);

//routers
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/assets/html/index.html');
});

app.get('/login/', (req, res) => {
    res.sendFile(__dirname + '/assets/html/index.html');
});

app.get('/register/', (req, res) => {
    res.sendFile(__dirname + '/assets/html/index.html');
});

app.get('/user/:userID', (req, res) => {
    res.sendFile(__dirname + '/assets/html/index.html');
});

app.get('/messages/', (req, res) => {
    res.sendFile(__dirname + '/assets/html/index.html');
});

app.get('/settings/', (req, res) => {
    res.sendFile(__dirname + '/assets/html/index.html');
});

//grabs js file for appropriate path
app.post('/api/get-js', (req, res) => {
    var { path } = req.body;
    path = path.pathname;
    var file = router.route(path);

    if (file) {
        file = file.split(' ');

        var js = file[0], css = file[1];
        res.send({ err: false, js, css });
    } else res.send({ err: true });
});

app.post('/api/get-user', async (req, res) => {
    var { id, token } = req.body;
    var data = await USERDATA.data(id, token);
    if (data.err) return res.send({ err: true, message: ERR_MSG });
    return res.send(data);
});

//socket stuff
io.on('connection', async (socket) => {

    socket.on('online', async (token) => {
        try {
            var user = jwt.verify(token, TOKEN);
            socket.join(user.usertag);
        } catch (e) {
            // Nothing
        }
    })

    /**
     * Converts ut and em to lower case, creates a user object which is passed to
     * register
     * 
     * Register creates a user 
     * Register always returns a message which is then emitted through the socket
     */

    socket.on('register', async (userTag, password, username, email) => {
        userTag = userTag.toLowerCase();
        email = email.toLowerCase();
        var user = {
            userTag,
            password,
            username,
            email
        }

        var registered = await register.create(user);
        io.to(socket.id).emit('alert', registered.message);
    });

    /**
     * Login will check the password and user tag details
     * returns either a token or a message
     */

    socket.on('login', async (ut, ps) => {
        var logged = await login.log(ut, ps);
        if (logged.message) return io.to(socket.id).emit('alert', logged.message);
        io.to(socket.id).emit('store', 'TOKEN', logged.token);
    });

    // Updates messages and then sends the message to each user
    socket.on('message', async (to, from, msg,) => {
        const res = await message.log(to, from, msg);

        io.to(res.msg.from).emit('msg', res.msg);
        io.to(res.msg.to).emit('msg', res.msg);
    });

    socket.on('settings', async (token, sets) => {
        settings.set(token, sets);
    });

    // Takes image and tests for mime type, will save it as the user avatar
    socket.on('img', async (token, img) => {
        if (!img || !token) return io.to(socket.id).emit('alert', 'Invalid image');
        var user = jwt.verify(token, TOKEN);

        if (/^img/.test(img.mimetype)) return io.to(socket.id).emit('alert', 'Invalid image');
        fs.writeFile(__dirname + '/assets/avatars/' + user.usertag + '.jpg', img, (err) => {
            io.to(socket.id).emit('alert', err ? ERR_MSG : 'Image uploaded');
            if(err) console.log(err);
        });

        settings.set(token, {
            avatar: '/avatars/' + user.usertag + '.jpg'
        });
    });
});

server.listen(port, () => console.log('Listening on ' + port));