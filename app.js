const express = require("express");
const app = express();
const path=require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {ListingSchema}= require("./schema.js");
const Review = require("./models/review.js");

const port = 8080;

//
main().then(()=>{
    console.log("Connected to DB successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); // for PUT and DELETE requests

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.engine("ejs", ejsMate); // using ejsMate for layout support


app.get("/",(req,res)=>{
    res.send("root is working");
});

//validation middleware for schema
const validateListing = (req,res,next)=>{
let result= ListingSchema.validate(req.body); //Joi validation for listing 
 if(result.error){
  throw new ExpressError(result.error,400);
 }else{
  next();
 }
}

//index route(listings)
app.get("/listings",wrapAsync(async(req,res,next)=>{
  const allListings=await Listing.find({});
  res.render("listings/index.ejs",{allListings: allListings});
}))

//new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});


//show route
app.get("/listings/:id", wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))

//create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
  // let listing = req.body.listing;
  let newListing = new Listing(req.body.listing);
  await newListing.save()
  .catch(err=>console.log(err));
  res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync( async(req,res,next)=>{
  let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res,next)=>{
 const result= ListingSchema.validate(req.body); //Joi validation for listing 
  let {id}=req.params;
  const UpdateListing =await Listing.findByIdAndUpdate(id, {...req.body.listing});
  await UpdateListing.save()
  .catch(err=>console.log(err));
  res.redirect(`/listings/${UpdateListing._id}`);
}))

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res,next)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id );
  res.redirect("/listings");
}))

//review 
//Post route
app.post("/listings/:id/review",async(req,res)=>{
  let listing= await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("review added");
  res.send("review added successfully you fool");
})

// app.get("/testlistings",async (req,res)=>{
//     let sampleListings = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing description.",
//         price: 100,
//         location: "Sample Location",
//         country: "Sample Country"
//     })
//     await sampleListings.save();
//     res.send("Sample listing created");
//     console.log("Sample listing created");
// })

//page not found route (404)
// app.all("*",(req,res,next)=>{
//   next(new ExpressError("page not found",404));
// })

app.get("/errorTesting",(req,res,next)=>{
  next(new ExpressError("page not found",404));
})
//Error handling middleware
app.use((err,req,res,next)=>{
  let {message}=err;
  console.log(err.message);
  console.log(err.stackTrace);
  res.render("listings/error.ejs",{message});
  // res.status(err.status || 500).send(err.message || "Something went wrong");
})

app.listen(port,()=>{
    console.log("server is running on port ",port);
});




