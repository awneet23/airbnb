const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema} = require('./schema.js');
const {reviewSchema} = require('./schema.js');
const Review = require('./models/review.js');
const port = 5000;
const listings = require('./models/listing.js');
const listingrouter = require('./routes/listing.js');
const reviewrouter = require('./routes/review.js');
const userrouter = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require('./models/user.js');
const sessionOptions = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true

  }
}

// Add this middleware to your Express app
// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store');
//   next();
// });
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()))

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser())



app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error')
  res.locals.CurrentUser = req.user;
  // console.log(req.user)
  // console.log('-------------------------------------')
  next();
})

// app.get('/demouser',async(req,res)=>{
//   let fakeuser = new user({
//     email:'abc@gmail.com',
//     username:'student'
//   })
//   let registereduser = await user.register(fakeuser,'helloworld')
//   res.send(registereduser);
// })



app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname, '/public')));

app.listen(port,()=>{
  console.log(`server i listening on port ${port}`)
});
app.get('/',(req,res)=>{
  res.send('hi i am root');
});
main().then((res)=>{
  console.log('db connected')
}).catch((err)=>{
  console.log(err);
})
async  function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.use('/listings',listingrouter);
app.use('/listings/:id/reviews', reviewrouter);
app.use('/',userrouter)
app.all('*',(req,res,next)=>{
next(new ExpressError(404,'Page not found'))
})

app.use((err,req,res,next)=>{
  let {status=400,message="something was wrong buddy!"} =  err;
  // res.status(status).send(message);
  res.render('error.ejs',{message});
})







