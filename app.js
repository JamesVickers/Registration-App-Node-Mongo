const express = require('express');
const mongo = require('mongodb');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();
const router = express.Router();
const db = mongoose.connection;


// set location for static files like .css
app.use(express.static(__dirname + '/public'))

// set the view engine to ejs
app.set('view engine', 'ejs');


// Routes *************************************************************************************

// enter page 
app.get('/', function(req, res) {
    // use res.render to load up an ejs view file
    res.render('pages/index');
});

// enter page 
app.get('/enter', function(req, res) {
    // use res.render to load up an ejs view file
    res.render('pages/enter');
});

// enter page 
app.get('/exit', function(req, res) {
    // use res.render to load up an ejs view file
    res.render('pages/exit');
});

// success page
app.get('/enter-success', function(req, res) {
    res.render('pages/enter-success');
});

// success page
app.get('/exit-success', function(req, res) {
    res.render('pages/exit-success');
});

// list page 
app.get('/list', (req, res) => {
    //list page queries db for all results and passes results to list.ejs in 'registers' variable
    db.collection('registers')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err)
      // else renders list.ejs
      res.render('pages/list', {registers: result})
    })
  })


// Handle submissions *************************************************************************

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/SigmaData';
mongoose.connect(mongoDB, { useNewUrlParser: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

var visitorSchema = new Schema({
    firstName: String,
    lastName: String,
    entryTime: {type: Date, default: Date.now}
});

// Compile model from schema
var visitorModel = mongoose.model('Register', visitorSchema );
var visitorModelInstance;

// on /enter form submission, save entry to db collection then redirect to /enter-success.ejs 
app.post('/enter', (req, res) => {
    visitorModelInstance = new visitorModel(req.body);
    visitorModelInstance.save()
    .then(item => {
       res.redirect('/enter-success');
    })
    .catch(err => {
        res.status(400).send('unable to save to database');
    });
    
});

// on /exit form submission, remove entry from db collection then redirect to /exit-success.ejs 
app.post('/exit', (req, res) => {
    //console.log(req.body);
    visitorModel.deleteOne( { 'firstName': req.body.firstName, 'lastName': req.body.lastName }, function (err, registers) {
        if (err) return handleError(err);
        res.redirect('/exit-success');
    });
});



// listen on port 3000
app.listen(process.env.port || 3000);


/*

setTimeout(function () {
    // if (entry time date === (Date.now() - 1 day)) 
    // db.collection.remove()
}, 10000)

 https://docs.mongodb.com/v3.2/reference/method/db.collection.remove/#db.collection.remove

*/
