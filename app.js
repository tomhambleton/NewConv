
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , logger = require('./logger')
  , action = require('./action')
  , path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(allowCrossDomain);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//
//Routes
//
app.get('/', function(req, res) { res.send("NewConv Test Server"); });

app.get('/hello', function(req, res) { res.send("Hi Tom"); });

app.post('/oauth/callback', function(req, res) {
	console.log(req.body);
	res.send(200);
	});

app.post('/log', function(req, res) {
console.log(req.body);
res.send(200);
});

app.put('/log', function(req, res) {
console.log(req.body);
res.send(200);
});
app.post('/callEvent', function(req,res) {
	var str = "CALL NOTIFICATION EVENT: \n"+ JSON.stringify(req.body, null, 2);
	logger.logMsg(str);
	res.send(200);
});
app.post('/playCollect', function(req,res) {
	var str = "PLAY/COLLECT EVENT: \n"+ JSON.stringify(req.body, null, 2);
	logger.logMsg(str);
	res.send(200);
});

app.post('/callDirectionParams', function(req, res) {
	action.setActions(req.body);
	res.send(200);
});

app.post('/callDirection', function(req,res) {
	action.handleEvent(req, res);
});

app.get('/getLogMsg', function(req, res) {
    logger.handleGetMsg(req, res);
});

app.get('/health', function(req, res) {
     res.send({
         pid: process.pid,
         memory: process.memoryUsage(),
         uptime: process.uptime()
     });
 });

process.on('uncaughtException', function (err) {
     var msg = "uncaughtException: "+err.message;
     console.error(msg);
     console.error(err.stack);
     process.exit(1);});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
