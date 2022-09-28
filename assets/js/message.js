var txtInput = createElement('span', 'textarea', 'txt-input', 'text', null, 'Enter your text');
var send = createElement('submit', null, 'txt-submit', 'submit', null, 'Send', 'Send');

var messageChildren = [
    createElement('div', null, 'txt-title', null, null, null, 'Messages'),
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