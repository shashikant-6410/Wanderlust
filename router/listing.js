const express = require("express");
const router = express.Router();

const {ListingSchema}= require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");



//validation middleware for listingSchema
const validateListing = (req,res,next)=>{
let result= ListingSchema.validate(req.body); //Joi validation for listing 
 if(result.error){
  throw new ExpressError(result.error,400);
 }else{
  next();
 }
}

//index route(listings)
router.get("/",wrapAsync(async(req,res,next)=>{
  const allListings=await Listing.find({});
  res.render("listings/index.ejs",{allListings: allListings});
}))

//new route
router.get("/new",(req,res)=>{
  res.render("listings/new.ejs");
});


//show route
router.get("/:id", wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//create route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
  // let listing = req.body.listing;
  let newListing = new Listing(req.body.listing);
  await newListing.save()
  .catch(err=>console.log(err));
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",wrapAsync( async(req,res,next)=>{
  let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res,next)=>{
//  const result= ListingSchema.validate(req.body); //Joi validation for listing 
  let {id}=req.params;
  const UpdateListing =await Listing.findByIdAndUpdate(id, {...req.body.listing});
  await UpdateListing.save()
  .catch(err=>console.log(err));
  res.redirect(`/listings/${UpdateListing._id}`);
}))

//delete route
router.delete("/:id",wrapAsync(async(req,res,next)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id );
  res.redirect("/listings");
}))


module.exports = router;

