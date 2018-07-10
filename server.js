// 'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

// require modules
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const btoa = require('btoa');
const atob = require('atob');
const cors = require('cors');

// require other files
const URL = require('./models/urlModel');

var app = express();
 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// main entry point
app.post("/api/shorturl/new", (req, res) => {
  let data = req.body;
  console.log('data', data);
  let url = data.url;
  console.log('url', url);
  // dns.lookup(url, (err, address, family) =>
  // console.log('address: %j family: IPv%s', address, family
  // ));

  let splitUrl = url.split('//');
  console.log('splitUrl', splitUrl)
  let realUrl = splitUrl[1];

  dns.lookup(realUrl, (err, address, family) => {
    console.log('address', address);
    if (address === undefined) {
      return res.send({
        "error": "invalid URL"
      })
    }
    URL.findOne({url: splitUrl}, (err, doc) => {
      if (doc) {
        console.log('entry found in the db', doc);
        res.send({
          url: realUrl,
          hash: btoa(doc._id),
          status: 200,
          statusTxt: 'OK'
        });
      } else {
        console.log('entry not found in the DB', doc);
        const url = new URL({
          url: realUrl,
          _id: 2
        });
        url.save((err) => {
          if(err) {
            return console.error(err);
          }
          return res.send({
            "original_url": realUrl,
            "short_url": btoa(url._id)
          })
        })
      }
    })
  })
});


app.get('/:hash', (req, res) => {
  var baseid = req.params.hash;
  var id = atob(baseid);
  URL.findOne({ _id: id }, (err, doc) => {
      if(doc) {
          res.redirect(doc.url);
      } else {
          res.redirect('/');
      }
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});