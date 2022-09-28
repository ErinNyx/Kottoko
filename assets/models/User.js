const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    usertag: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    auth: { type: Boolean, required: true },
    messages: { type: Array, required: true },
    notebook: { type: Array, required: true },
    lesson: { type: String, required: true },
    dictionary: { type: Array, required: true },
    chatrooms: { type: Array, required: true },
    profile: { type: String, required: true },
    pronouns: { type: String, required: true },
    joined: { type: String, required: true }
    //usertag, avatar, username, messages, admin, notebook, lesson, dictionary, chatrooms, profile, pronouns, joined
}, { collection: 'users' });

const model = mongoose.model('User', UserSchema);

module.exports = model;