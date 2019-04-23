var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser')
var app = express();

var express = require('express');
var app = express();
var http = require('http').Server(app);
var ws = require("socket.io")(http);
var cfenv = require('cfenv');
var IoTApp  = require('./application/application.js');

/*
  Get the app environment from Cloud Foundry,
  if you are developing locally (VCAP_SERVICES environment variable not set),
  cfenv will use the file defined by vcapFile instead.
  You can export these local json files from IBM Cloud!
*/
var app_env = cfenv.getAppEnv({vcapFile: 'vcap.json'});
const IOT_PLATFORM = "matterhorn";

/* Retrieve Cloud Foundry environment variables. */
var credentials = app_env.getServiceCreds(IOT_PLATFORM);
var application = new IoTApp(credentials.org, credentials.apiKey, credentials.apiToken);

/* Application is an event emitter, so we listen for the payload event we defined in application.js! */
application.on('payload', function(data) {
  /* We then broadcast to our clients.  */
  ws.emit('broadcast', data);
});

// View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Set static folder
app.use(express.static(path.join(__dirname + '/public')));

app.use(bodyParser());

var routes = require('./routes/index');
var users = require('./routes/users');
app.use('/users', users);
app.use('/', routes);
app.use('/index', routes);

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'));