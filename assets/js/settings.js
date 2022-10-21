//type, className, id, typeOf, parent, placeholder, content, children

//Creating the page
var user = await userdata(JSON.parse(atob(localStorage.getItem('TOKEN').split('.')[1])).usertag);

var pronouns = createElement('input', null, 'pronouns', 'text', null, 'Please enter your preferred pronouns');
var profile = createElement('textarea', null, 'txt-input', 'text', null, null, processText(user.profile));
var avatar = createElement('button', null, 'av-ch', null, null, null, 'Change your avatar');
var submit = createElement('input', null, null, 'submit', null, 'Submit');
var password;

var formChildren = [
    pronouns,
    profile,
    avatar,
    submit
];

var form = await createElement('form', null, 'settings-form', null, '#main-content', null, null, formChildren);

document.getElementById('txt-input').setAttribute('contenteditable', true);
document.getElementById('txt-input').setAttribute('role', 'textbox');

var modalBack;
var settingsField;

const submitForm = document.getElementById('settings-form');
const avatarButt = document.getElementById('av-ch');

// Submit settings change
submitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    var value = false;
    if(document.getElementById('txt-input').value !== user.profile) value = document.getElementById('txt-input').value;

    var sets = {
        pronouns: document.getElementById('pronouns').value,
        profile: value
    }

    socket.emit('settings', localStorage.getItem('TOKEN'), sets);
    window.location.href = window.location.href;
});

// Check for enter conditions
document.getElementById('txt-input').addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && (!e.shiftKey && !e.altKey)) e.preventDefault();
});

// Image upload form
avatarButt.addEventListener('click', async (e) => {
    e.preventDefault();
    var close = createElement('a', null, 'av-close', null, null, null, 'Close', null)
    var avFormChildren = [
        close,
        createElement('input', null, 'file', 'file'),
        createElement('input', null, null, 'submit', null, 'Submit')
    ]

    var avform = await createElement('form', null, 'avatar-form', null, null, null, null, avFormChildren);
    avform.enctype = 'multipart/formdata';

    await createElement('div', null, 'av-back', null, '#main-content');

    close.onclick = () => {
        document.getElementById('av-back').remove();
    }

    document.getElementById('av-back').appendChild(avform);

    avform.addEventListener('submit', (e) => {
        socket.emit('img', localStorage.getItem('TOKEN'), document.getElementById('file').files[0]);
    })
});

/*document.getElementById('txt-input').addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData ? (e.originalEvent || e).clipboardData.getData('text/plain') :
    window.clipboardData
        ? window.clipboardData.getData('Text')
        : '';
    
    document.getElementById('txt-input').innerHTML += text;
});*/