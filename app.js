// basic imports and requirements
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const { decrypt } = require('./crypto');
const helmet = require('helmet');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

// routers for different pages
var usersRouter = require('./routes/users');
var bookingsRouter = require('./routes/bookings');
var contactRouter = require('./routes/contact');
var shopRouter = require('./routes/shop');
var favoritesRouter = require('./routes/favorites');
const { ObjectID } = require('mongodb');

// use express
var app = express();

// connect to mongodb
MongoClient.connect(process.env.MONGOURI, (err, client) => {
  if (err) {
    throw err;
  }
  // store dbs
  const db = client.db('photodb')
  const users = db.collection('users');
  const bookings = db.collection('bookings');
  const configdb = db.collection('configdb');
  const false_users = db.collection('false_users');
  app.locals.users = users;
  app.locals.bookings = bookings;
  app.locals.configdb = configdb;
  app.locals.false_users = false_users;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// var requestIp = require('request-ip');
// app.use(requestIp.mw());

// app.use(function(req, res) {
//   var ip = req.clientIp;
//   console.log(ip);
//   // res.send(ip + '\n');
//   // return;
  
// });


// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(helmet({
    contentSecurityPolicy: false,
  })
);

// var requestIp = require('request-ip');
// app.use(requestIp.mw());

// console.log("hi")
// app.use(function(req, res) {
//   var ip = req.clientIp;
//   console.log("ip: " +ip);
//   // res.send(ip + '\n');
//   // return;
//   res.end();
// });


// use sessions 
app.use(session({
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// use passport authentication
passport.use(new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
},
  (req, email, password, authCheckDone) => {
    app.locals.users
      .findOne( { email: email.toLowerCase() })
      .then(user => {
        if (!user) {
          // if email is not found
          return authCheckDone(null, false)
        }

        if (decrypt({ iv: user.iv, content: user.password }) !== password) {
          // if password incorrect
          return authCheckDone(null, false)
        }

        // properly authenticated
        return authCheckDone(null, user)
      })
      .catch((err) => {
        // error
        return authCheckDone(null, false)
      });
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GCLIENTID,
  clientSecret: process.env.GCLIENTSECRET,
  callbackURL: "https://thomasyarnell.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, authCheckDone) {
  app.locals.users
    .findOne( { googleId: profile.id } )
    .then(user => {
      console.log("ran")
      if (!user) {
        // googleId not found
        // look for regular email (traditional account)
        app.locals.users.findOne( { email: profile.emails[0].value.toLowerCase() } ).then(doc => {

          if(doc){
            // if found, attach the googleId onto that document
            app.locals.users.updateOne({ _id: ObjectID(doc._id) }, { $set: { "googleId": profile.id } })
            .then(doc2 => {
              app.locals.users.findOne({ googleId: profile.id }).then((user) => {
                if(user){
                  console.log("found")
                  return authCheckDone(null, user);
                } 
                else{
                  console.log("not found")
                  return authCheckDone(null, false);
                }
              })
              .catch((err) => {
                console.log(err)
                return authCheckDone(null, false);
              });
              // properly authenticated
              // return authCheckDone(null, user);
  
            }).catch((err) => {
  
              // error
              return authCheckDone(null, false);
  
            })
          }
          else{
            // user does not have a traditional account, create a gAccount for them
            app.locals.users
              .insertOne({ googleId: profile.id, first_name: profile.name.givenName, last_name: profile.name.familyName, email: profile.emails[0].value, "cart": [], "favorites": [], "bookings": [] })
              .then((doc) => {
                // properly authenticated
                app.locals.users.findOne({ googleId: profile.id }).then((user) => {
                  if(user){
                    console.log("found")
                    return authCheckDone(null, user);
                  } 
                  else{
                    console.log("not found")
                    return authCheckDone(null, false);
                  }
                })
                .catch((err) => {
                  console.log(err)
                  return authCheckDone(null, false);
                });
                //return authCheckDone(null, user)
              })
              .catch((err) => {
                // error
                return authCheckDone(null, false)
              });
          }

          

        })
        .catch((err) => {

          // error
          return authCheckDone(null, false);
        
        });
    
      }
      else{
        // googleId found, properly authenticated
        return authCheckDone(null, user)
      }
    })
    .catch((err) => {
      // error
      return authCheckDone(null, false)
    });
  }
));

// store userdata
passport.serializeUser((user, done) => {
  done(null, { googleId: user.googleId, id: user._id, email: user.email, password: user.password, first_name: user.first_name, last_name: user.last_name, phone_num: user.phone_num, iv: user.iv, bookings: user.bookings, cart: user.cart, favorites: user.favorites });
});

// grab userdata
passport.deserializeUser((userData, done) => {
  done(null, userData);
});




// other webpage routers
app.use('/', usersRouter);
app.use('/', bookingsRouter);
app.use('/', contactRouter);
app.use('/', shopRouter);
app.use('/', favoritesRouter);

// google oauth middleware
app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  }));

// google callback
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// serve react file
app.use(express.static(path.join(__dirname,'/build')))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
});


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(port))

module.exports = app;
