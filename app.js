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

// Oops page
app.get('/oops', function(req, res) {
    res.render('pages/oops');
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
var cosmosDB = 'mongodb://sigma-registration-app-db.documents.azure.com:443/';
mongoose.connect(process.env.MONGO_URL || cosmosDB || mongoDB, { useNewUrlParser: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Added the following 'mongoose.set' to remove this console warning:
//(node:3916) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
//mongoose.set('useCreateIndex', true)

//Define a schema
var Schema = mongoose.Schema;

var visitorSchema = new Schema({
    firstName: { type: String, uppercase: true },
    lastName: { type: String, uppercase: true },
    entryTime: {type: Date, default: Date.now},
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
    visitorModel.deleteOne( { 'firstName': req.body.firstName.toUpperCase(), 'lastName': req.body.lastName.toUpperCase() }, function (err, response) {
        if (err) return handleError(err);
       // response contains { n: 1, ok: 1 }
       if (response.n > 0) {
        res.redirect('/exit-success');
       } else {
        res.redirect('/oops');
       }
    });
});

// Database purging at midnight every day *************************************************************************

// TTL does not work with mongoose, so setTimeout function used instead.
//setHours(24,0,0,0) is next midnight. setHours(24,0,0,0) is last midnight.
var timeOfDeletion = new Date().setHours(24,00,0,0) - Date.now(); // next midnight

setTimeout(function()
    {
        db.dropCollection("registers", function (err, result) {
            if (err) {
                console.log("error delete collection");
            } else {
                console.log("delete collection success");
            }
        })
    }, timeOfDeletion);

    
// listen on port 3000
app.listen(process.env.port || 3000);
