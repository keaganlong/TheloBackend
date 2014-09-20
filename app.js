
/**
 * Module dependencies.
 */
var routes = [
              "./routes/channels",
              "./routes/events"
            ];

var models = [
              "./models/Channel",
              "./models/Event"
              ];

var express = require('express')
  , http = require('http')
  , path = require('path'),
  mongoose = require( 'mongoose' );

var secret = require('./secret');

mongoose.connect(secret.db);
console.log(secret.db);
console.log(mongoose);
mongoose.connection.on('error', function(error) {
  console.error(error);
});

models.forEach(function (routePath) {
    var model = require(routePath);
    model(mongoose);
});

var app = express();
app.use(express.bodyParser());

routes.forEach(function (routePath) {
    var route = require(routePath);
    route(app,mongoose);
});

app.set('port', process.env.PORT || 3000);

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
