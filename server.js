'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

var cors = require('cors');

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
    console.log('family', family);
    console.log('err', err);
    res.send('Data collected!');
  })
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});