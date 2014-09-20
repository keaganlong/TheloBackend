
/**
 * Module dependencies.
 */
var routes = [
              "./routes/channels"
            ];

var models = [
              "./models/Channel"
              ];

var express = require('express')
  , http = require('http')
  , path = require('path'),
  mongoose = require( 'mongoose' );

mongoose.connect('mongodb://localhost/TheloDev');

models.forEach(function (routePath) {
    var model = require(routePath);
    model(mongoose);
});

var app = express();

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
