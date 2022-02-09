const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const user_jwt = require('../middleware/user_jwt');
//const { JsonWebTokenError } = require('jsonwebtoken');
const {registerValidation , loginValidation} = require('../validation_user');



// FETCH AUTH DATA USING TOKEN
router.get('/',user_jwt , async(req,res,next) =>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success:true,
            user:user
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            success:false,
            msg:'Server error'
        })
        next();

    }

});



router.post('/register', async (req,res,next) => {
    // VALIDATE DATA BEFORE USER
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    const {fName , lName , phoneNum , email , password , birthDate , gender} = req.body;
    //const date = new Date(req.body.birthDate);


    try{
        let user_exist = await User.findOne({email : email});
        // check if user already exist
        if(user_exist){
            res.json({
                success : false,
                msg: " User already exist"

            });
        } // end if

    let user = new User();
    user.fName = fName;
    user.lName = lName;
    user.phoneNum = phoneNum;
    user.email = email;
    user.password = password;
    user.birthDate = birthDate;
    user.gender = gender;

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password , salt);

    let size = 200;
    user.avatar = "https://gravatar.com/avatar/?s="+size+'&d=retro';

    await user.save();
    const payload = {
        user:{
            id:user.id
        }
    }

    jwt.sign(payload , process.env.jwtUserSecret, {
        expiresIn: "2h",
    },(err,token) => {
        if(err) throw err;
        res.status(200).json({
            success:true,
            token:token
        });
    })
    

    }catch(err){
        console.log(err);
    } // end try-catch
});

// LOGIN ROUTER
router.post('/login', async(req,res,next) => {
     // VALIDATE DATA BEFORE USER
     const {error} = loginValidation(req.body);
     if(error) return res.status(400).send(error.details[0].message);

    const email = req.body.email;
    const password = req.body.password;
    try{
        // Searching for user email if exist!
        let user = await User.findOne({
            email:email
        });
        if(!user){
            res.status(400).json({
                success:false,
                msg:'User not exists go and register to continue'
            });
        }
        // We need to match password from user input to database password
        const isMatch = await bcryptjs.compare(password , user.password);
        if(!isMatch){
            return res.status(500).json({
                success:false,
                msg:'Invalid password'
            });
        }
        const payload = {
            user:{
                id:user.id
            }
        }
        jwt.sign(payload , process.env.jwtUserSecret, {
            expiresIn: "2h",
        },(err,token) => {
            if(err) throw err;
            res.status(200).json({
                success:true,
                msg:'Logged In',
                token:token,
                user:user
            });
        })


    }catch(error){
        console.log(error.message);
        res.status(500).json({
            success:false,
            msg:'Server Error'
        });
    }
});
module.exports = router;