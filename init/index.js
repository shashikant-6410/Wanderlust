const mongoose = require("mongoose");
const initialData = require("../init/data.js");
const Listing = require("../models/listing");

const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
// const dbUrl=process.env.ATLAS_URL;


main().then(()=>{
    console.log("Connected to DB successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);

}

const initializeDatabase = async () => {
    // Clear existing listings and insert initial data
    await Listing.deleteMany({});
    initialData.data = await initialData.data.map((obj)=>({...obj, owner:"689cc7c838bf773e4da703d4"}));
    await Listing.insertMany(initialData.data);
    console.log("Database initialized with sample data");
}

initializeDatabase().catch((err) =>{
    console.log("error initializing database",err);
})
