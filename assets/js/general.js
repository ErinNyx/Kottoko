var token;
if (localStorage.getItem('TOKEN')) token = localStorage.getItem('TOKEN')
else token = false;

//General Use Functions
const socket = io();

// Creates a popup with info sent from server
socket.on('alert', (msg) => {
    modal('<jp>こ</jp> Kottoko', msg);
});

// Stores info sent from server
socket.on('store', (key, value) => {
    localStorage.setItem(key, value);
    switch (key) {
        case 'TOKEN':
            window.location.href = '/';
            break;
    }
});

// Important to log a user as online with their UUID to use it later for things like chatrooms
socket.emit('online', localStorage.getItem('TOKEN'));

// Logs the user in
async function login() {
    var token = localStorage.getItem('TOKEN');
    token = token.split('.');

    var user = atob(token[1]);
    user = JSON.parse(user);

    document.getElementById('login-butt').removeAttribute('href');
    document.getElementById('login-butt').innerHTML = 'Logout';
    document.getElementById('login-butt').onclick = () => {
        localStorage.removeItem('TOKEN');
        window.location.href = window.location.href;
    }

    document.getElementById('register').remove();

    document.getElementById('prof-butt').href = '/user/' + user.usertag;

    await createElement('a', null, 'settings', null, 'nav', null, 'Settings');
    document.getElementById('settings').href = '/settings/';
}

// Processes BBCode in reverse so that it's formatted correctly when users go to change profile settings
function processText(text) {
    return text.toString()
        .replaceAll(/>/g, "]")
        .replaceAll(/</g, "[")
        .replaceAll("[br]", `\r\n`)
        .replaceAll("[span class='bb-img']", "[img]")
        .replaceAll("[style class='bb-style']", "[style]")
        .replaceAll("[/span]", "[/img]");
}


// Uses the window location to send a JSON request to the server
// Response is then set as the JS file for this page.
async function load() {
    const file = await fetch("/api/get-js", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            path: window.location
        })
    }).then((res) => res.json());

    if (file.err) return document.querySelector('#main-content').innerHTML += 'We\'ve run into an unexpected error. If the issue persists after a reload please ' +
        'contact the webmaster @ erinemrysnyx@gmail.com';

    var script = document.createElement('script');
    var css = document.createElement('link');
    var theme;

    script.setAttribute('src', '/js/' + file.js);
    script.setAttribute('type', 'module');

    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('href', '/css/' + file.css);

    document.querySelector('head').appendChild(script);
    document.querySelector('head').appendChild(css);

    if (localStorage.getItem('theme')) theme = localStorage.getItem('theme') + '.css'
    else theme = 'default.css';

    css = document.createElement('link');

    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('href', '/css/themes/' + theme);

    document.querySelector('head').appendChild(css);

    if (localStorage.getItem('TOKEN')) login(localStorage.getItem('TOKEN'));
}

// Creates an HTML node
// TODO Consider reworking the variables
function createElement(type, className, id, typeOf, parent, placeholder, content, children) {
    var newEl = document.createElement(type);
    if (className) newEl.setAttribute('class', className);
    if (content) newEl.innerHTML = content;
    if (placeholder) newEl.setAttribute('placeholder', placeholder);
    if (typeOf) newEl.setAttribute('type', typeOf);
    if (children) for (var i in children) newEl.appendChild(children[i]);

    if (parent) document.querySelector(parent).appendChild(newEl);
    if (id) newEl.id = id;

    return newEl;
}

// Theme Selection
function changeThemes() {
    localStorage.setItem('theme', document.querySelector('#theme').value);
    window.location.reload();
}

// Closes popups
function closeModal() {
    document.getElementById('modal').remove();
}

// Popup function
function modal(tit, cont) {
    var title = createElement('div', null, 'poptit', null, null, null, tit);
    var content = createElement('div', null, 'popcont', null, null, null, cont);
    var close = createElement('a', null, 'popclose', null, null, null, 'Close');
    var popupChildren = [title, content, close];
    var popup = createElement('div', null, 'pop', null, null, null, null, popupChildren);
    var children = [popup];

    createElement('div', null, 'modal', null, 'html', null, null, children);

    document.getElementById('popclose').onclick = () => closeModal();
}

// Grabs user data
async function userdata(usertag) {
    const data = await fetch("/api/get-user", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: usertag,
            token
        })
    }).then((res) => res.json());
    return data;
}

load();

// More Theme selection
var t = document.querySelector('#theme');
t.value = localStorage.getItem('theme') || 'default';
t.addEventListener('change', (e) => {
    changeThemes();
});

// If a user image doesn't have a source, set that source to the default image
async function popUserImages() {
    var images = document.querySelectorAll('.uAvatar');

    for(var i in images) {
        var usertag, user;
        if(!images[i].value) continue;

        usertag = images[i].value;
        user = await userdata(usertag);

        if(user.avatar) images[i].src = user.avatar;
    }
}