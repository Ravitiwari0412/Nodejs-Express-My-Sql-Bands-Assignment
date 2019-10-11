const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('./config/checkAuth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index'));

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
  

 module.exports = router;