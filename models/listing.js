const { required } = require('joi');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Review = require('./review.js');
const User = require('./user.js')

const listingSchema = new schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2VhfGVufDB8fDB8fHww',
    set: (v) => {
      return v === '' ? 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2VhfGVufDB8fDB8fHww' : v;
    }
  },
  price:{type:Number,
    required:true,
  }
  ,
  location: String,
  country: String,
  reviews:[
    {
      type:schema.Types.ObjectId,
      ref:Review
    }
  ],
  owner:{
    type:schema.Types.ObjectId,
    ref:User
  }
});
listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing && listing.reviews.length > 0) {
   
          // Delete reviews that are referenced in the listing's reviews array
          const result = await Review.deleteMany({ _id: { $in: listing.reviews } });
          console.log(result); // Log the result of the deletion
    
          
      }
  
  console.log('hello world');
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
