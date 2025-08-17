const Listing = require("./models/listing");


module.exports.isLoggedIn= (req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
    req.flash("error","Login is required ");
   return res.redirect("/login");
  }
  next();
}


module.exports.isOwner = async(req,res,next)=>{
  let {id}= req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","you dont have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
