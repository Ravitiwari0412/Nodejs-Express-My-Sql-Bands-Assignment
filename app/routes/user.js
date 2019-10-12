var express = require('express');

var models = require('../models/index');

var router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/checkAuth');

const passport = require('passport');


// Login 

router.get('/login', forwardAuthenticated, (req, res) => {
    console.log("inside login");

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

// // Register
// router.post('/register', (req, res) => {
//     const  { name,company,dob, email, password,password2} = req.body;
//     let errors = [];
  
//     if (!name || !dob || !password || !email) {
//       errors.push({ msg: 'Please enter all fields' });
//     }
//     if (!EmailValidator(data.email)){

//         return res.render('register', { user: req.user, error: 'Invalid Email' });
    
//       } 
//     if (password != password2) {
//       errors.push({ msg: 'Passwords do not match' });
//     }
  
//     if (password.length < 6) {
//       errors.push({ msg: 'Password must be at least 6 characters' });
//     }
//     if (new Date(data.dob) > new Date()){

//         return res.render('register', { user: req.user, error: 'Invalid DoB' });
    
//       }
  
//     if (errors.length > 0) {
//       res.render('signup', {
//         errors,
//         name,
//         company,
//         dob,
//         email,
//         password,
//         password2
//       });
//     } else {
//       models.users.findOne({ email: email }).then(user => {
//         if (user) {
//           errors.push({ msg: 'Email already exists' });
//           res.render('signup', {
//             errors,
//             name,
//             company,
//             dob,
//             email,
//             password,
//             password2
//           });
//         } else {
//                models.users.create({
//             name,
//             company,
//             dob,
//             email,
//             password,
            
//           });
  
//           bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(newUser.password, salt, (err, hash) => {
//               if (err) throw err;
//               newUser.password = hash;
//               newUser
//                 .save()
//                 .then(user => {
//                   req.flash(
//                     'success_msg',
//                     'You are now registered and can log in'
//                   );
//                   res.redirect('/user/login');
//                 })
//                 .catch(err => console.log(err));
//             });
//           });
//         }
//       });
//     }
//   });

router.post('/register', forwardAuthenticated, (req, res) => {



  var data = {

    name: req.body.name,

    company: req.body.company,

    dob: req.body.dob,

    email: req.body.email,

    password: req.body.password

  };

  if (!data.name || !data.dob || !data.email || !data.password) {

    return res.render('register', { user: req.user, error: 'All fields required.' });

  }

  if (new Date(data.dob) > new Date()){

    return res.render('register', { user: req.user, error: 'Invalid DoB' });

  }

  if (!EmailValidator(data.email)){

    return res.render('register', { user: req.user, error: 'Invalid Email' });

  }

  models.Users.findOne({

    where: { email: data.email }

  })

    .then((user) => {

      if (user) return res.render('register', { user: req.user, error: 'Email already exist' });

      if (data.password < 3) {

        return res.render('register', { user: req.user, error: 'Password must be greater than 3.' });

      }

      models.Users.create(data).then((user) => {

        console.log("cdcdcd \n" + user);



        passport.authenticate('local')(req, res, function () {

          return res.redirect('/dashboard');

        });

      })

        .catch((err) => {

          console.log("New error\n" + err);



        });

    }).catch((err) => {

      console.log("Error baby\n\n" + err);

    });





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