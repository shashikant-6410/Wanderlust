const mongoose = require("mongoose");
const initialData = require("../init/data.js");
const Listing = require("../models/listing");

main().then(()=>{
    console.log("Connected to DB successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initializeDatabase = async () => {
    // Clear existing listings and insert initial data
    await Listing.deleteMany({});
    await Listing.insertMany(initialData.data);
    console.log("Database initialized with sample data");
}

initializeDatabase().catch((err) =>{
    console.log("error initializing database",err);
})
