var express = require('express');
var app = express();
var path = require('path')
const flash =require('connect-flash')
var cookieParser = require('cookie-parser')

//Passport Authentication
var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
//var exphbs = require('express-handlebars')
//var env = require('dotenv').load();


//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// For Passport
 
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions

//connecting Flash
app.use(flash());

//For Handlebars
// app.set('views', './app/views')
// app.engine('hbs', exphbs({
//     extname: '.hbs'
// }));


//Handle post requests using body parser

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');


app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'styles')));

//Models
var models = require("./app/models");





//load passport strategies
require('./app/config/passport/passport.js')(passport, models.users);
 
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});
 
 
// Fetch all routes

app.use('/',  require('./routes/index'));
app.use('/users', require('./routes/user.js'));

 
 


// 404 Page response 

app.use( (req, res, next) => {

	const error = new Error('Page not Found!');

	error.status = 	404;

	res.render("error");

})



app.listen(3000, function(err) {
 
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});