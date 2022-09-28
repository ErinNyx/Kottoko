var children = [createElement('img', 'uAvatar', null), createElement('input', null, 'uTag', 'text', null, 'User Tag'), createElement('input', null, 'pass', 'password', null, 'Password'), createElement('input', null, 'log-butt', 'submit',  null, 'Submit', 'Submit')];
var form = createElement('form', null, 'login', null, '#main-content', null, null, children);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    socket.emit('login', document.getElementById('uTag').value, document.getElementById('pass').value);
});