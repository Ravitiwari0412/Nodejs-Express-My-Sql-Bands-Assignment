const express = require('express');
const router = express.Router();



var models = require('../models/index');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/checkAuth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index', { user: req.user }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {

    models.Bands.findAll({ where: { userId: req.user.id } })
  
      .then(Bands => {
  
        res.render('dashboard',
  
          {
  
            user: req.user,
  
            Bands: Bands
  
          }
  
        );
  
      });
  
  });


  // Create Bands

router.get('/createBands', ensureAuthenticated, function (req, res) {

    res.render('createBands', { user: req.user, error: req.flash('error')[0] });
  
  });
  
  
  
  router.post('/createBands', ensureAuthenticated, function (req, res) {
  
    var bandInfo = {
  
      name: req.body.name,
  
      artist: req.body.artist,
  
      userId: req.user.id
  
    };
  
    if (!bandInfo.name || !bandInfo.artist) {
  
      return res.render('createBands', { user: req.user, error: 'All fields required.' });
  
    }
  
  
  
    if (!isNaN(bandInfo.artist)) {
  
      return res.render('createBands', { user: req.user, error: 'Artist should not be numeric.' });
  
    }
  
    models.Bands.findOne({
  
      where: { name: bandInfo.name }
  
    })
  
      .then((band) => {
  
        if (band) return res.render('createBands', { user: req.user, error: 'Music band already entered' });
  
        models.Bands.create(bandInfo);
  
        res.redirect('/dashboard');
  
      })
  
      .catch((err) => {
  
        console.log("Error Creating music band\n\n" + err);
  
      });
  
  
  
  });


  // Edit  Bands

router.get('/editBands/:id', ensureAuthenticated, function (req, res, next) {
  console.log("inside get editbands");

  models.Bands.findOne({where: {id:req.params.id}})

  .then(bands => {

    if (bands.userId !== req.user.id){

      return res.redirect('/dashboard');

    }

    res.render('editBands', 

    { 

      user: req.user,

      Bands: bands,

      error: req.flash('error')[0]

    });

  });

});
  
// Update bands 

router.post('/editBands/:id', ensureAuthenticated,function (req, res, next) {  

  console.log("inside post editbands");

  models.Bands.findOne({where: {id:req.params.id}})

  .then(bands => {

    if (!req.body.name || !req.body.artist) {

   

     

       return res.render('editBands', { user: req.user, Bands: bands,error: 'All fields required.' });

    }   

     if (!isNaN(req.body.artist)) {

      return res.render('editBands', { user: req.user, Bands: bands,error: 'Artist name could not be numeric.' });

     }

 

      bands.update({

      name: req.body.name,

      artist: req.body.artist

      }).then( ()=>{

      res.redirect('/dashboard');

    });

    })

    .catch((err) => {

      console.log("Error editing band\n\n" + err);

    });

});


  
  router.get('/deleteBands/:id', function (req, res,next) {
  
      models.Bands.findOne({where: {id:req.params.id}})
    
      .then(band => {  
    
        if (band.userId !== req.user.id){
    
          return res.redirect('/dashboard');
    
        }
    
        band.destroy();
    
        res.redirect('/dashboard');
    
        });
    
        
    
    });

    // Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});
  

 module.exports = router;