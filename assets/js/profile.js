var token;
if(localStorage.getItem('TOKEN')) token = localStorage.getItem('TOKEN')
else token = false;

async function userdata() {
    const data = await fetch("/api/get-user", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: window.location.href.split('/')[4],
            token
        })
    }).then((res) => res.json());
    return data;
}

const user = await userdata();

console.log(user);

var uInfoTop_children = [
    createElement('p', null, 'uInfo-Title', null, null, null, user.username),
    createElement('img', 'uAvatar', 'uInfoAvatar')
];

var uInfoBottom_children = [
    createElement('p', null, 'joined-on', null, null, null, 'Joined on '+user.joined),
    createElement('p', null, 'pronouns', null, null, null, 'Pronouns: '+user.pronouns)
];

var uInfoTop = createElement('div', null, null, null, null, null, null, uInfoTop_children);
var uInfoBottom = createElement('div', null, null, null, null, null, null, uInfoBottom_children);

var pSection_title = createElement('div', null, null, null, null, null, user.username + '\'s Profile');
var pSection_content = createElement('div', null, null, null, null, null, user.profile);

var uInfo_children = [uInfoTop, uInfoBottom];
var pSection_children = [pSection_title, pSection_content];

var userInfo = createElement('div', null, 'uInfo', null, '#main-content', null, null, uInfo_children);
var profileSection = createElement('div', null, 'pSection', null, '#main-content', null, null, pSection_children);