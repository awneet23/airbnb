const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js')
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {isLoggedIn} = require('../middleware.js')
const {isOwner} = require('../middleware.js')

const ValidateListing = (req,res,next)=>{
  const { error } = listingSchema.validate(req.body,{ abortEarly: false }); // Correct usage

  if (error) {
      return next(new ExpressError(400, error.details.map(err => err.message).join(', ')));
  }
  else{
    next()
  }

}
// first page
router.get('/',async (req,res)=>{
  const allListings = await Listing.find({})
 //  console.log(allListings)
   res.render('listings/index.ejs',{allListings,title:'bike'});
 
 })
 
 //Get a form to Add a new listing
 router.get('/new',isLoggedIn,(req,res)=>{
  res.render('listings/new');
   })
 
 // Route to get an individual listing, and add a review
 router.get('/:id',wrapAsync(async (req,res)=>{
   let {id} = req.params;
  const listing =  await Listing.findById(id).populate({path:'reviews',populate:{
    path:'author'
  }}).populate('owner');
  // console.log(listing.reviews[1].author)
  res.render('listings/show',{listing})
 }))

 // adding a new listing
 router.post('/',isLoggedIn,ValidateListing, wrapAsync(async (req, res, next) => {
  let sampleListing = new Listing(req.body);
  sampleListing.owner = req.user._id;
  console.log(sampleListing.owner);
  await sampleListing.save();
  req.flash('success','New listing added');
  console.log('saved');
  res.redirect('/listings');
}));





//Gets a form to edit the listing 
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id)
  res.render('listings/edit',{listing})
}))

//updates the listing
router.put('/:id',isLoggedIn,isOwner,ValidateListing,wrapAsync(async (req,res)=>{
  let {id} = req.params;
 const updatedlisting = await Listing.findByIdAndUpdate(id,req.body,{new:true});
 req.flash('success','listing updated');
res.redirect('/listings')
}))

// Delete 
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash('success','listing deleted');
  res.redirect('/listings');
}))

module.exports = router;