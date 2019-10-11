module.exports = {

    ensureAuthenticated(req, res, next) {
  
      if (req.isAuthenticated()) {
  
        return next();
  
      }
  
      res.redirect('/signin')
  
    },
  
    forwardAuthenticated(req, res, next) {
  
      if (req.isAuthenticated()) {
  
        return res.redirect('/dashboard')
  
      }
  
      next();
  
    }
  
  
  
  };