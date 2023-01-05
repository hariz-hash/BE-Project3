const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf= require('csurf');
require("dotenv").config();

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
const landingRoutes = require('./routes/landing')
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary.js')
const cartRoutes = require('./routes/cart')
const checkoutRoutes = require('./routes/checkout')

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
}

main();

app.listen(3012, () => {
  console.log("Server has started");
});
