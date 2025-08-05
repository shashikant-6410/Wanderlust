const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {reviewSchema}= require("../schema.js");


//validation middleware for Review
const validateReview = (req,res,next)=>{
let result= reviewSchema.validate(req.body); //Joi validation for Review 
 if(result.error){
  throw new ExpressError(result.error,400);
 }else{
  next();
 }
}

//review 
//Post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
  let listing= await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}))

//delete review route
router.delete("/:review_Id",wrapAsync(async(req,res)=>{
     let {id,review_Id}=req.params;
    //  console.log(id,review_Id);
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_Id}}); //pull is used to remove the data from array
     await Review.findByIdAndDelete(review_Id);
     res.redirect(`/listings/${id}`);
}));



module.exports = router;







