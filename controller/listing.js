const Listing = require("../models/listing");


//for index route
module.exports.index = async(req,res,next)=>{
  const allListings=await Listing.find({});
  res.render("listings/index.ejs",{allListings: allListings});
};

//for new route
module.exports.renderNewForm= (req,res)=>{
  res.render("listings/new.ejs");
}

//for show route
module.exports.showListing = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author"
      }
    })
    .populate("owner");
    if(!listing){
      req.flash("error","Listing You Searched For Doesn't exist!");
      res.redirect("/listings");
    }else{
       res.render("listings/show.ejs",{listing});
    }
}

//for create route
module.exports.createListing = async (req,res,next)=>{
  // let listing = req.body.listing;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save()
  .catch(err=>console.log(err));
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
}

//for edit route
module.exports.renderEditForm = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async(req,res,next)=>{
//  const result= ListingSchema.validate(req.body); //Joi validation for listing 
  let {id}=req.params;
  const UpdateListing =await Listing.findByIdAndUpdate(id, {...req.body.listing});
  await UpdateListing.save()
  .catch(err=>console.log(err));
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${UpdateListing._id}`);
}

//for delete route
module.exports.destroyListing = async(req,res,next)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id );
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}