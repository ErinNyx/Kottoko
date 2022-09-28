const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./assets/models/User.js');

const TOKEN = 'jbBILAEKNJDVegnjug$^LKNEAG.DKZNFXBM&*LQERAND&*^(LKERNA)(*rjunuriojh23r89HE8*(%HNOn*&^oUOBbu99BbNJAJGJAEBN;KJu989BBU9ih@#$(*';

async function check(usertag, email, ps) {
    if(!ps || typeof ps !== "string") return ({ err: true, message: 'Invalid password' });
    if(await User.findOne({ usertag }) || typeof usertag !== 'string') return ({ err: true, message: 'Invalid username or already in use' });
    if(!email || typeof email !== "string" || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) || await User.findOne({ email })) return ({ err: true, message: 'Invalid email or already in use' });
    return ({ err: false });
}

const create = async (user) => {
    try {
        //usertag, avatar, username, messages, admin, notebook, lesson, dictionary, chatrooms, profile, pronouns, joined
        var password = user.password;
        var admin = user['admin'] = false;
        var auth = user['auth'] = false;
        var username = user.username;
        var email = user.email;
        var usertag = user.userTag
        var checked = await check(usertag, email, password);

        var month = new Date().getMonth();
        var date = new Date().getDate();
        var year = new Date().getFullYear();

        var messages = [], notebook = [], lesson = 'Introduction', dictionary = [], chatrooms = [], 
        profile = 'If this is your profile you can edit it by going to your settings :)', pronouns = 'They/Them';

        var joined = ''+date+'/'+(month+1)+'/'+year;

        if(checked.err) return checked;

        password = await bcrypt.hash(password, 10);
        
        await User.create({
            usertag,
            email,
            username,
            password,
            admin,
            auth,
            messages, 
            notebook,
            lesson,
            dictionary,
            chatrooms,
            profile,
            pronouns,
            joined
        }); 

        return ({ message: 'User created! Before attempting to sign in, check your email for authentication.'});
    } catch(err) {
        console.log(err);
        return ({message: 'Something went horribly wrong. If the issue persists after reload, please contact the webmaster @ erindanytenyx@gmail.com'});
    }
}

module.exports = {
    create
}