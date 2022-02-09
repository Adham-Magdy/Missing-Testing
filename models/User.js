const mongoose = require('mongoose');
const userInfoSchema = new mongoose.Schema({
    
    fName:{
        type:String,
        required:true,
        min:3,
        max:255
        
    },
    lName:{
        type:String,
        required:true,
        min:3,
        max:255
    },
    phoneNum:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        max:255,
        min:6
    },
    password:{
        type:String,
        required:true,
        max:255,
        min:6
    },
    birthDate:{
        type:Date,
        default:Date.now
    },
    avatar:{
        type: String
    },
    gender:{
        type:String,
        required:true,
        max:20,
        min:6
    }
});
module.exports = mongoose.model('User', userInfoSchema);
