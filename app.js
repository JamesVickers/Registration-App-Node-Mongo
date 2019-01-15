/* Routes ****************************************************************************/

const express = require('express');
const mongo = require('mongodb');
const app = express();
const path = require('path');
const router = express.Router();


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// list page 
app.get('/list', (req, res) => {
    db.collection('registers')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err)

      // renders index.ejs
      res.render('pages/list.ejs', {registers: result})
    })
  })

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);


/* Handle form submissions **********************************************************/

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/SigmaData", { useNewUrlParser: true });

const db = mongoose.connection;

//mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/SigmaData", { useNewUrlParser: true });


let nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    entryTime: {type: Date, default: Date.now}
});

let User = mongoose.model("Register", nameSchema);

app.post("/", (req, res) => {
    var myData = new User(req.body);
    myData.save()
    .then(item => {
        res.send("item saved to database");
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });
});


/* Query database *******************************************************/






/*
************ Previous code, now obsolete, here for my reference only ***********

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("SigmaData");
    let myobj = { firstName: "James", lastName: "Vickers"};
    dbo.collection("Register").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
});
*/