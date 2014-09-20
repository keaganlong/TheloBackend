
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path'),
  mongoose = require( 'mongoose' );

var app = express();
mongoose.connect('mongodb://localhost/TheloDev');

var channelSchema = new mongoose.Schema({
	  name: { type: String }
});

var Channel = mongoose.model('Channel', channelSchema);

var gtFoodChannel = new Channel({
	name:"GT-FOOD"
});

gtFoodChannel.save(function(err, thor) {
  if (err) return console.error(err);
  console.dir(thor);
});

app.set('port', process.env.PORT || 3000);

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
