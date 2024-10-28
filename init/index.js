const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

main().then(()=>{
  console.log('db connected')
}).catch((err)=>{
  console.log(err);
})
async  function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=>{
  console.log(await Listing.deleteMany({}));
  await Review.deleteMany({});
  console.log('now adding')
  initdata.data= initdata.data.map((ob)=>({...ob,owner:'671e07596f178a4d7c968a09'}))
  await Listing.insertMany(initdata.data);
  console.log('Data added')
}
initDB();