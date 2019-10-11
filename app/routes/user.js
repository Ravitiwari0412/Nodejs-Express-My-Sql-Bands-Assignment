var express = require('express');

var models = require('./models/index');

var router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/checkAuth');

const passport = require('passport');


// Login 

router.get('/login', forwardAuthenticated, (req, res) => {

    res.render('signin', { user: req.user, error: req.flash('error')[0] });
  
  });


  router.post('/login', passport.authenticate('local', {

    successRedirect: '/dashboard',
  
    failureRedirect: '/login',
  
    failureFlash: true
  
  }));


  
// Register

router.get('/register', forwardAuthenticated, (req, res) => {

    res.render('signup', { user: req.user, error: req.flash('error')[0] });
  
  });

// Register
router.post('/register', (req, res) => {
    const  { name,company,dob, email, password,password2} = req.body;
    let errors = [];
  
    if (!name || !dob || !password || !email) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (!EmailValidator(data.email)){

        return res.render('register', { user: req.user, error: 'Invalid Email' });
    
      } 
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (new Date(data.dob) > new Date()){

        return res.render('register', { user: req.user, error: 'Invalid DoB' });
    
      }
  
    if (errors.length > 0) {
      res.render('signup', {
        errors,
        name,
        company,
        dob,
        email,
        password,
        password2
      });
    } else {
      models.users.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('signup', {
            errors,
            name,
            company,
            dob,
            email,
            password,
            password2
          });
        } else {
               models.users.create({
            name,
            company,
            dob,
            email,
            password,
            
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

  // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });

  function EmailValidator(email) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    return re.test(String(email).toLowerCase());
  
  }
  module.exports = router;