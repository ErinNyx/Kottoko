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

const router = require('./router.js');
const register = require('./register.js');
const login = require('./login.js');
const USERDATA = require('./UserData.js');

const app = express();
const server = http.createServer(app);
const port = process.env.port || 80;

const { Server } = require('socket.io');
const io = new Server(server);

const ERR_MSG = '';

//geese
mongoose.connect('mongodb+srv://erinn:Erin12374274Nyx!@cluster0.n1czf6d.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//endpoints
app.use(express.static(__dirname + '/assets'));
app.use(favicon(__dirname + "/assets/images/favicon.ico"));
app.use(bodyParser.json());

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
    if(data.err) return res.send({ err: true, message: ERR_MSG });
    return res.send(data);
});

//socket stuff
io.on('connection', async (socket) => {
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
});

server.listen(port, () => console.log('Listening on ' + port));