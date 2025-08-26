const Listing = require("../models/listing");
const axios = require("axios");

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
      return res.redirect("/listings");
    }
    
    let coords = null;
    
    try {
    // Forward geocoding using Nominatim API
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        format: "json",
        q: listing.location
      }
    });

    if (response.data.length > 0) {
      coords = {
        lat: response.data[0].lat,
        lng: response.data[0].lon
      };
    }
  }catch (err) {
    return next(err);
  }
    
   res.render("listings/show.ejs",{listing,coords});
    
}

//for create route
module.exports.createListing = async (req,res,next)=>{
  // let listing = req.body.listing;
  let url = req.file.path;
  let filename= req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image={url,filename};
  // console.log(newListing);
  await newListing.save()
  .catch(err=>console.log(err));
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
}

//for edit route
module.exports.renderEditForm = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","requested listing doesn't exists");
      res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res,next)=>{
//  const result= ListingSchema.validate(req.body); //Joi validation for listing 
  let {id}=req.params;
  let UpdateListing =await Listing.findByIdAndUpdate(id, {...req.body.listing});

  if(req.file){
  let url = req.file.path;
  let filename= req.file.filename;
  UpdateListing.image ={url,filename};
  }

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