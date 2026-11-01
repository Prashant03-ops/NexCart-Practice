const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role :{
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    verified : {
        type : Boolean,
        default : false
    }
})

module.exports = moongoose.model("User", userSchema);