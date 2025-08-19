const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview,isLoggedIn,isAuthor}= require("../middleware.js");
const reviewController = require("../controller/reviews.js")


//review 
//Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview))

//delete review route
router.delete("/:review_Id",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));



module.exports = router;







