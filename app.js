const express = require("express");
const app = express();
const path=require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema}= require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./router/listing.js");
const reviews = require("./router/review.js")
const session = require("express-session");
const { createSecretKey } = require("crypto");

const port = 8080;
//
main().then(()=>{
    console.log("Connected to DB successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const sessionOptions={
  secret:"mysecretId",
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+ 7 * 24 * 60 * 60 * 1000, //one week time from current time
    maxAge:7 * 24 * 60 * 60 * 1000 ,
    httpOnly:true
  }
}

app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); // for PUT and DELETE requests

//express router for listings
app.use("/listings", listings);

//express router for reviews
app.use("/listings/:id/reviews", reviews);


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.engine("ejs", ejsMate); // using ejsMate for layout support


app.get("/",(req,res)=>{
    res.send("root is working");
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

app.listen(port,()=>{
    console.log("server is running on port ",port);
});




