if(process.env.NODE_ENV != "production"){
      require("dotenv").config();
}

const express = require("express");
const app = express();
const path=require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./router/listing.js");
const reviews = require("./router/review.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./router/user.js")

const PORT = process.env.PORT || 8080;

const dbUrl=process.env.ATLAS_URL;

//
main().then(()=>{
    console.log("Connected to DB successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
  mongoUrl:dbUrl,
  touchAfter: 24 * 3600 , // time period in seconds
  crypto:{
    secret:process.env.SECRET
  }
});

store.on("error",(err)=>{
  console.log("error in MONGO SESSION STORE",err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+ 7 * 24 * 60 * 60 * 1000, //one week time from current time
    maxAge:7 * 24 * 60 * 60 * 1000 ,
    httpOnly:true
  }
}

app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); // for PUT and DELETE requests

//flash message middleware
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.engine("ejs", ejsMate); // using ejsMate for layout support


//express router for listings
app.use("/listings", listings);

//express router for reviews
app.use("/listings/:id/reviews", reviews);

//express router for user
app.use("/", user);




//demoUser for registration
// app.get("/demoUser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"example@gmail.com",
//     username:"fake-student"
//   })
//   const fakeRegisterdStudent= await User.register(fakeUser,"hi_student");
//   res.send(fakeRegisterdStudent);

// })

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

//page not found route (404)
// app.all("*",(req,res,next)=>{
//   next(new ExpressError("page not found",404));
// })

// app.get("/errorTesting",(req,res,next)=>{
//   next(new ExpressError("page not found",404));
// })
//Error handling middleware
app.use((err,req,res,next)=>{
  let {message}=err;
  // console.log(err.message);
  // console.log(err.stackTrace);
  res.render("listings/error.ejs",{message});
  // res.status(err.status || 500).send(err.message || "Something went wrong");
})

app.listen(PORT,()=>{
    console.log("server is running on port ",PORT);
});




