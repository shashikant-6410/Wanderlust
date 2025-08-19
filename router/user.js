const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");

router.route("/signup")
.get((req,res)=>{
    res.render("user/signup.ejs");
})
.post(wrapAsync(async(req,res)=>{
    try{
    let {username , email,password}=req.body;
    let newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    //auto login after signup
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

router.route("/login")
.get((req,res)=>{
    res.render("user/login.ejs");
})
//passport.authenticate is a middleware to authenticate the username and password 
.post(passport.authenticate("local" ,{failureRedirect:'/login' , failureFlash:true}),async(req,res)=>{
    try {
        req.flash("success","WelcomeBack to Wanderlust");
        res.redirect("/listings");
    } catch (error) {
          req.flash("error", error.message);
        res.redirect("/login");
    }
})

//req.logout is builtin function of passport to logout the user(delete the session data)
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
})

module.exports = router;