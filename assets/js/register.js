// Creating the page
var children = [createElement('input', null, 'email', 'text', null, 'Email'), 
createElement('input', null, 'uTag', 'text', null, 'User Tag'), 
createElement('input', null, 'username', 'text', null, 'Username'), 
createElement('input', null, 'pass', 'password', null, 'Password'), 
createElement('input', null, 'log-butt', 'submit',  null, 'Register', 'Register'),
createElement('div', 'help-tip', null, null, null, null, null, 
[createElement('p', null, null, null, null, null, 'What is a User Tag? It is what allows our users to have any display ' +
' name they want while retaining a Unique User ID (UUID). Your user tag has to be unique but you can have any username you want :) ' + 
' Don\'t worry about changing it later, changing your username is simple and easy!')])];

var form = createElement('form', null, 'login', null, '#main-content', null, null, children);

// Submit registration
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    var userTag = document.querySelector('#uTag').value, username = document.querySelector('#username').value, 
        password = document.querySelector('#pass').value, email = document.querySelector('#email').value;
    socket.emit('register', userTag, password, username, email);
});