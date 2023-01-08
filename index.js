const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf= require('csurf');
require("dotenv").config();
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);
// set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}))

// enable flash messages
app.use(flash());

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// enable CSRF
// app.use(csrf());

const csrfInstance = csrf(); // create an instance of the middleware
app.use(function(req,res,next){
  // check if the url we are accessing should excluded from csrf protection
  if (req.url == "/checkout/process_payment" || req.url.slice(0, 5) == '/api/') {
    return next();
  }
  csrfInstance(req,res,next);  // implement protection for all other routes 
})

//PROXY MIDDLEWARE


app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back');
  } else {
      next()
  }
});

const api = {
  product : require('./routes/api/product'),
  user: require('./routes/api/user'),
  cart: require('./routes/api/cart'),
  checkout: require('./routes/api/checkout')

}

const landingRoutes = require('./routes/landing')
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary.js')
const cartRoutes = require('./routes/cart')
const checkoutRoutes = require('./routes/checkout')
const orderRoutes = require('./routes/order')

// Share the user data with hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
})

async function main() {
 app.use('/', landingRoutes)
 app.use('/products', productRoutes);
 app.use('/users', userRoutes);
 app.use('/cloudinary', cloudinaryRoutes);
 app.use('/carts', cartRoutes)
 app.use('/checkout', checkoutRoutes)
 app.use('/order', orderRoutes)
 app.use('/api/products', api.product);
 app.use('/api/user', api.user);
 app.use('/api/cart', api.cart);
 app.use('/api/checkout', api.checkout);
}

main();

app.listen(3030, () => {
  console.log("Server has started");
});
