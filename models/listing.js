const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("./review");
const { required } = require("joi");
const  Schema= mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true        
    },
    description:{
        type:String       
    },
    image:{

        url:String,
        filename:String
        // type:String,
        //  default:
        //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        // set: (v) =>
        //     v === ""
        //         ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        //         : v,
     },
    price:{
        type:Number      
    },
    location:{
       type: String
       
    },
    country:{
        type:String     
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

//express post  middleware for deleting the reviews if the listing associated with it is deleted
listingSchema.post("findByIdAndDelete",wrapAsync(async(listing)=>{
    if(listing){
        await Review.DeleteMany({_id:{$in:listing.reviews}});
    }
}))

const Listing = new mongoose.model("Listing",listingSchema);

module.exports = Listing;
