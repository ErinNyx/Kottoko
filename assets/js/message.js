var usertag = localStorage.getItem('TOKEN');
usertag = usertag.split('.')[1];
usertag = atob(usertag);
usertag = JSON.parse(usertag);
usertag = usertag.usertag;

var person = 'Messages';
const user = await userdata(usertag);

// Msg handling
socket.on('msg', (msg) => {
    document.getElementById('txt-input').innerHTML = '';
    writeMessage(msg);
});

// Load person talking to
if (user.messages[user.messages.length-1] || localStorage.getItem('msg-to')) person = 
    (localStorage.getItem('msg-to') || user.messages[user.messages.length - 1].usertag);

// Creates a message and writes to the text box
async function writeMessage(msg) {
    var ch = [
        createElement('div', null, null, null, null, null, msg.from),
        createElement('div', null, null, null, null, null, msg.content)
    ];

    var msg = createElement('div', null, null, null, null, null, null, ch);
    document.getElementById('txt-box').prepend(msg);
}

// Creates an object to define where the message is being sent and what type
// Then, send the message to the server to be updated in the DB
function sendMsg() {
    var to = {
        usertag: localStorage.getItem('msg-to'),
        type: 'pm'
    }

    var from = localStorage.getItem('TOKEN');
    var msg = document.getElementById('txt-input').innerHTML;
    document.getElementById('txt-input').innerHTML = '';

    socket.emit('message', to, from, msg.trim());
}

// Creates a user field for the people you have talked to in the past
async function createUser(ut, n) {
    var pData = await userdata(ut);
    if(pData.err) return alert('Something went terribly wrong! Please contact webmaster @ erindanytenyx@gmail.com');
    

    await createElement('div', 'usered', 'user' + n, null, '#users');
    await createElement('img', 'uAvatar', 'user' + n + '-avatar', null, '#user'+n);

    if (pData.avatar) document.getElementById('user' + n + '-avatar').setAttribute('src', pData.avatar);

    document.getElementById('user' + n).setAttribute('value', ut);
    const user = await createElement('p', null, null, null, '#user' + n, null, pData.username);
    user.onclick = () => setUser(ut);
}

// Start Page Creation
var txtInput = createElement('span', 'textarea', 'txt-input', 'text', null, 'Enter your text');
var send = createElement('submit', null, 'txt-submit', 'submit', null, 'Send', 'Send');

var messageChildren = [
    createElement('div', null, 'txt-title', null, null, null, 'To: ' + person),
    createElement('div', null, 'txt-box'),
    createElement('form', null, 'txt-form', null, null, null, null, [txtInput, send])
];

var userChildren = [
    createElement('div', null, 'users-title', null, null, null, 'Your Conversations'),
    createElement('div', null, 'users')
];

var messageWindow = createElement('div', null, 'msg-window', null, null, null, null, messageChildren);
var userWindow = createElement('div', null, 'user-window', null, null, null, null, userChildren);

var children = [
    userWindow,
    messageWindow
];

var mainWindow = await createElement('div', null, 'msg-box', null, '#main-content', null, null, children);

document.getElementById('txt-input').setAttribute('contenteditable', true);
document.getElementById('txt-input').setAttribute('role', 'textbox');

// End Page Creation

// Submits message on button click
document.getElementById('txt-form').addEventListener('submit', (e) => {
    e.preventDefault();
    sendMsg();
});

// Submits message on enter
document.getElementById('txt-input').addEventListener('keypress', (e) => {
    if (e.key == 'Enter' && (!e.altKey && !e.shiftKey)) sendMsg();
});

// Loads messages in from user object, defining which messages are being loaded in with a filter
// Then, it updates the people you're talking to so that the last person should always be on top with no repeats . . . at least
// That's the theory
async function loadMessages(p) {
    var u = await userdata(usertag);
    var msgToLoad = u.messages.filter(m => 
            (m.to == user.usertag || m.to == p) && (m.from == user.usertag || m.from == p) && (m.to !== m.from));
    var peopleTalkingTo = u.messages.map(m => (m.to));
    peopleTalkingTo = [...new Set(peopleTalkingTo)];
    for(var i in msgToLoad) writeMessage(msgToLoad[i]); 
    for(var i in peopleTalkingTo) await createUser(peopleTalkingTo[i], i);
}

// Changes the user a person is talking to when they try to switch chats
// TODO 
// Look at this later because it's working but it's not . . . quite . . . the best
// Function seems to have some issues with running immediately on click and doesn't run every time
// Weird bug.
function setUser(val) {
    document.getElementById('txt-box').innerHTML = '';
    document.getElementById('users').innerHTML = '';
    document.getElementById('txt-title').innerHTML = val;
    localStorage.setItem('msg-to', val);

    loadMessages(val);
}

await loadMessages(localStorage.getItem('msg-to'));