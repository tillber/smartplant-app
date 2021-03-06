var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();

var http = require('http').Server(app);
var ws = require("socket.io")(http);
var cfenv = require('cfenv');
var IoTApp = require('./application/application.js');

app.use(express.static(__dirname + '/public'));

/*
  Get the app environment from Cloud Foundry,
  if you are developing locally (VCAP_SERVICES environment variable not set),
  cfenv will use the file defined by vcapFile instead.
  You can export these local json files from IBM Cloud!
*/
var app_env = cfenv.getAppEnv({vcapFile: 'vcap.json'});
const IOT_PLATFORM = "SmartplantII1302";

/*Retrieve Cloud Foundry environment variables.*/
var credentials = app_env.getServiceCreds(IOT_PLATFORM);
var application = new IoTApp(credentials.org, credentials.apiKey, credentials.apiToken);

/* Application is an event emitter, so we listen for the payload event we defined in application.js!*/
application.on('payload', function(data) {
  /* We then broadcast to our clients.*/
  //console.log(data);
  ws.emit('broadcast', [{min: 0, max: JSON.parse(data).humidity}, {min: 0, max: JSON.parse(data).ph}, {min: 0, max: JSON.parse(data).temp}]);
});

// View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
app.use(bodyParser());

var routes = require('./routes/index');
var users = require('./routes/users');
var plants = require('./routes/plants');
app.use('/users', users);
app.use('/', routes);
app.use('/index', routes);
app.use('/plants', plants);

/*app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'));*/
console.log(app_env.port);
http.listen(app_env.port || 4096, function() {});
