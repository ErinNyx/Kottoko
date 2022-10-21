// Create Page
const user = await userdata(window.location.href.split('/')[4]);

var uInfoTop_children = [
    createElement('p', null, 'uInfo-Title', null, null, null, user.username),
    createElement('img', 'uAvatar', 'uInfoAvatar')
];

var uInfoBottom_children = [
    createElement('p', null, 'joined-on', null, null, null, 'Joined on '+user.joined),
    createElement('p', null, 'pronouns', null, null, null, 'Pronouns: '+user.pronouns),
    createElement('p', null, 'msg', null, null, null, 'Message'),
    createElement('p', null, 'block', null, null, null, 'Block')
];

var uInfoTop = createElement('div', null, null, null, null, null, null, uInfoTop_children);
var uInfoBottom = createElement('div', null, null, null, null, null, null, uInfoBottom_children);

var pSection_title = createElement('div', null, null, null, null, null, user.username + '\'s Profile');
var pSection_content = createElement('div', null, null, null, null, null, user.profile);

var uInfo_children = [uInfoTop, uInfoBottom];
var pSection_children = [pSection_title, pSection_content];

var userInfo = createElement('div', null, 'uInfo', null, '#main-content', null, null, uInfo_children);
var profileSection = createElement('div', null, 'pSection', null, '#main-content', null, null, pSection_children);

document.querySelector('#uInfoAvatar').value = user.usertag;

document.getElementById('msg').onclick = () => {
    localStorage.setItem('msg-to', user.usertag);
    window.location.href = '/messages/'
}