const mongoose = require('mongoose').default;

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const Admin = mongoose.model('admins', AdminSchema);

module.exports = { Admin };