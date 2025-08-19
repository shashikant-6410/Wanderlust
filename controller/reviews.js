const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.postReview = async(req,res)=>{
  let listing= await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Added!");
  res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReview = async(req,res)=>{
     let {id,review_Id}=req.params;
    //  console.log(id,review_Id);
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_Id}}); //pull is used to remove the data from array
     await Review.findByIdAndDelete(review_Id);
     req.flash("success","Review Deleted!");
     res.redirect(`/listings/${id}`);
}