const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
//VALIDATE THE DATA BEFORE WE MAKE A USER
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

//CHECKING IF USER IS REGISTERED
    const emailExist = await User.findOne({ email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

//HASHING THE PASSWORDS
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


//CREATE A NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err){
        res.status(400).send(err);
    }
});
//LOGIN
    router.post('/login', async (req,res) => {
    
//VALIDATE THE DATA BEFORE WE MAKE A USER
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
//CHECKING IF THE EMAIL EXISTS
        const user = await User.findOne({ email: req.body.email});
        if(!user) return res.status(400).send('Email is not found');
    
//PASSWORD IS CORRECT
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid password');
en
//CREATE A TOKEN
        const token = jwt.sign({ _id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
});

module.exports = router;   
