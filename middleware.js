const { session } = require("passport");
const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user)
  if (!req.isAuthenticated()) {
    
   req.session.redirectUrl = req.originalUrl;
   console.log(req.session.redirectUrl )
   req.flash('error','you must be logged in');
   return res.redirect('/login');
  } 
  next();
}



module.exports.saveRedirectUrl = (req, res, next) => {

  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
   
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  let {id} = req.params;
  let listing  = await Listing.findById(id)
  if(!listing.owner._id.equals(res.locals.CurrentUser._id)){
    req.flash('error','You are not the owner')
    return res.redirect(`/listings/${id}`)
  }
  next()
}


module.exports.isReviewAuthor = async (req, res, next) => {
  let {reviewId,id} = req.params;
  let review  = await Review.findById(reviewId)
  if(!review.author._id.equals(res.locals.CurrentUser._id)){
    req.flash('error','You are not the author')
    return res.redirect(`/listings/${id}`)
  }
  next()
}



//   <h1><%= listing.owner.username %></h1>


