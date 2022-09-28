//General Use Functions
const socket = io();

socket.on('alert', (msg) => {
    modal('<jp>こ</jp> Kottoko', msg);
});

socket.on('store', (key, value) => {
    localStorage.setItem(key, value);
    switch (key) {
        case 'TOKEN':
            window.location.href = '/';
            break;
    }
});

//Uses the window location to send a JSON request to the server
//Response is then set as the JS file for this page.

function parseLineBreaks(text) {
    return text.replaceAll(/(?:\r\n|\r|\n)/g, '[br]');
}

function checkBBCode(value) {
    const codes = {
        0: { bb: "[br]", html: "<br>" },
        1: { bb: "[img]", html: "<img style='height: auto; max-width: 98%;' src='" },
        2: { bb: "[/img]", html: "'></img><br>" },
        3: { bb: "[b]", html: "<b>" },
        4: { bb: "[/b]", html: "</b>" },
        5: { bb: "[i]", html: "<i>" },
        6: { bb: "[/i]", html: "</i>" },
        7: { bb: "[s]", html: "<s>" },
        8: { bb: "[/s]", html: "</s>" },
        9: { bb: "[h1]", html: "<h1>" },
        10: { bb: "[/h1]", html: "[/h1]" },
        11: { bb: "[h2]", html: "<h2>" },
        12: { bb: "[/h2]", html: "[/h2]" },
        13: { bb: "[h3]", html: "<h3>" },
        14: { bb: "[/h3]", html: "[/h3]" },
        15: { bb: "[h4]", html: "<h4>" },
        16: { bb: "[/h4]", html: "[/h4]" }
    }
    for (var i = 0; i < Object.values(codes).length; i++) if (codes[i]) value = value.replaceAll(codes[i].bb, codes[i].html);
    return value;
}

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

    var settings = await createElement('a', null, 'settings', null, 'nav', null, 'Settings');
    document.getElementById('settings').href = '/settings/';
}

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

function changeThemes() {
    localStorage.setItem('theme', document.querySelector('#theme').value);
    window.location.reload();
}

function closeModal() {
    document.getElementById('modal').remove();
}

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

load();

var t = document.querySelector('#theme');
t.value = localStorage.getItem('theme') || 'default';
t.addEventListener('change', (e) => {
    changeThemes();
});