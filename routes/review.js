const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js')
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {isLoggedIn,isReviewAuthor} = require('../middleware.js')

const {reviewSchema} = require('../schema.js');
const ValidateReview = (req,res,next)=>{
  const {error} = reviewSchema.validate(req.body,{ abortEarly: false }); 

  if (error) {
      return next(new ExpressError(400, error.details.map(err => err.message).join(', ')));
  }
  else{
    next()
  }

}

router.post('/', isLoggedIn,ValidateReview, wrapAsync(async (req, res) => {
  const { id } = req.params; // Get the listing ID from params
  let review = new Review(req.body);

    review.author = req.user._id;
    console.log(review)
    console.log('-------------------------------------------------')

  await review.save();
  let listing = await Listing.findById(id);
  listing.reviews.push(review._id);
  await listing.save();
  req.flash('success','review created');
  res.redirect(`/listings/${id}`); // Redirect back to the listing
}));

router.delete('/:reviewId', isLoggedIn,isReviewAuthor,wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params; // Get both listing ID and review ID from params

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','review deleted');
  res.redirect(`/listings/${id}`); // Redirect back to the listing
}));


 module.exports = router;


 