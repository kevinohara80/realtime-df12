/***********************************
 * module dependencies             *
 ***********************************/

var express = require('express');
var app     = module.exports = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var twitter = require('ntwitter');
var nforce  = require('nforce');
var port    = process.env.PORT || 3000;

var user    = process.env.SFDC_USERNAME || '{yourusername@salesforce.com}';
var pass    = process.env.SFDC_PASSWORD || '{yourpassword}';
var key     = process.env.SFDC_KEY || '{SFDC APP KEY}';
var secret  = process.env.SFDC_SECRET || '{SFDC APP SECRET}';
var env     = process.env.SFDC_ENV || 'production';

var twitter_user_key     = process.env.TWITTER_USER_KEY || '{TWITTER USER KEY}';
var twitter_user_secret  = process.env.TWITTER_USER_SECRET || '{TWITTER USER SECRET}';
var twitter_key          = process.env.TWITTER_KEY || '{TWITTER KEY}';
var twitter_secret       = process.env.TWITTER_SECRET || '{TWITTER SECRET}';

var hashtag   = process.env.HASHTAG || '#funonbun';
var phone     = process.env.PHONE || '{+1 555-555-1212}';
var url       = process.env.URL || '{http://localhost:3000/demo}';

var oauth;

/***********************************
 * express configuration           *
 ***********************************/

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser()); 
  app.use(express.session({ secret: 'fajdlfjadslkfja' }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/***********************************
 * socket.io configuration         *
 ***********************************/

io.configure(function () { 
  io.set('transports', ['xhr-polling']); 
  io.set('polling duration', 10); 
  io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
  console.log('client connected to socket.io');
});

/***********************************
 * force.com streaming             *
 ***********************************/

var org = nforce.createConnection({
  clientId: key,
  clientSecret: secret,
  redirectUri: 'http://localhost:3000/oauth/_callback',
  apiVersion: 'v25.0',  // optional, defaults to v24.0
  environment: env  // optional, sandbox or production, production default
});

org.authenticate({ username: user, password: pass}, function(err, resp){
  if(err) return console.log('Unable to connect to force.com. Error: ' + err.message);
  console.log('Authenticated with force.com!');
  oauth = resp;
  var str = org.stream('AccountInserts', oauth);
  str.on('connect', function(){
    console.log('connected to force.com pushtopic');
  });
  str.on('error', function(error) {
    console.log('force.com stream error: ' + error);
  });
  str.on('data', function(data) {
    // send the data to all listeners
    io.sockets.emit('force', JSON.stringify(data));
  });
});

/***********************************
 * twitter streaming               *
 ***********************************/

var twit = new twitter({
  consumer_key: twitter_user_key,
  consumer_secret: twitter_user_secret,
  access_token_key: twitter_key,
  access_token_secret: twitter_secret
});

twit.stream('statuses/filter', { track: hashtag }, function(stream) {
  stream.on('data', function (data) {
    // send the data to all listeners
    io.sockets.emit('twitter', JSON.stringify(data));
  });
});

/***********************************
 * express routes                  *
 ***********************************/

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express',
    hashtag: hashtag,
    phone: phone,
    url: url
  });
});

app.get('/demo', function(req, res){
  res.render('demo', {
    title: 'Demo'
  });
});

app.post('/recsms', function(req, res) {
  io.sockets.emit('twilio', JSON.stringify(req.body));
  res.end();
});

app.get('/color/:color', function(req, res){
  var acc = nforce.createSObject('Account');
  acc.Name = req.params.color;
  org.insert(acc, oauth, function(err, response){
    if(!err) { 
      console.log('changed force.com color to ' + acc.Name);
      res.end();
    }
  });
});

/***********************************
 * app initialization              *
 ***********************************/

server.listen(port);
console.log('Realtime app running on port ' + port);