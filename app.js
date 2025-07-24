const express = require("express");
const app = express();
const path=require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

//index route(listings)
app.get("/listings",async(req,res)=>{
  const allListings=await Listing.find({});
  res.render("listings/index.ejs",{allListings: allListings});
})

//new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});


//show route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//create route
app.post("/listings",async (req,res)=>{
  // let listing = req.body.listing;
  let newListing = new Listing(req.body.listing);
  await newListing.save()
  .catch(err=>console.log(err));
  res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async(req,res)=>{
  let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
app.put("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  const UpdateListing =await Listing.findByIdAndUpdate(id, {...req.body.listing});
  await UpdateListing.save()
  .catch(err=>console.log(err));
  res.redirect(`/listings/${UpdateListing._id}`);
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id );
  res.redirect("/listings");
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

app.listen(port,()=>{
    console.log("server is running on port ",port);
});



