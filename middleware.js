const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {reviewSchema}= require("./schema.js");
const {ListingSchema}= require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// middleware for checking the user is logged in
module.exports.isLoggedIn= (req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
    req.flash("error","Login is required ");
   return res.redirect("/login");
  }
  next();
}

//middleware to identify the currentUser as owner 
module.exports.isOwner = async(req,res,next)=>{
  let {id}= req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","you dont have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//validation middleware for Review
module.exports.validateReview = (req,res,next)=>{
let result= reviewSchema.validate(req.body); //Joi validation for Review 
 if(result.error){
  throw new ExpressError(result.error,400);
 }else{
  next();
 }
}

//validation middleware for listingSchema
module.exports.validateListing = (req,res,next)=>{
let result= ListingSchema.validate(req.body); //Joi validation for listing 
 if(result.error){
  throw new ExpressError(result.error,400);
 }else{
  next();
 }
}

//middleware to identify the currentUser as author 
module.exports.isAuthor = async(req,res,next)=>{
  let {id,review_Id}= req.params;
  let review = await Review.findById(review_Id);
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error","you dont have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};