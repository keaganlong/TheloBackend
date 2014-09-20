var Event;
var Channel;

function getAllEventsWithinRange(req, res) {
	var input = req.body;
	var lat = input.lat;
	var lng = input.lng;
	var range = input.range;
	var channelName = input.channelName;
	Channel.findOne({name:channelName}).populate('events').exec(function(err,channel){
		var filteredEvents = filterEventsByLatLndRange(channel.events,lat,lng,range);
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ events:filteredEvents  }));
	});
}

function filterEventsByLatLndRange(events,lat,lng,range){
	var output = [];
	for(var i = 0; i<events.length;i++){
		var currEvent = events[i];
		if(currEvent.lat){//TODO REMOVE THIS HACK AFTER CLEAN DATA
			var distance = getDistanceBetweenTwoPoints(lat,lng,currEvent.lat, currEvent.lng);
			console.log(distance);
			if(distance <= range){
				output.push(currEvent);
			}
		}
		
	}
	return output;
}

function getDistanceBetweenTwoPoints(lat1,lon1,lat2,lon2){
	var R = 6371;
	Number.prototype.toRadians = function() {
		   return this * Math.PI / 180;
	}
	var φ1 = lat1.toRadians();
	var φ2 = lat2.toRadians();
	var Δφ = (lat2-lat1).toRadians();
	var Δλ = (lon2-lon1).toRadians();

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;
	return d;
}

function createEvent(req, res) {
	var eventInput = req.body;
	//TODO Validation !~@~!
	var channelName = eventInput.channelName;
	Channel.findOne({ name: channelName }).populate('events').exec(function(err,channel){
		if(!channel || err){
			//TODO Return message stuff false yeah
		}
		else{
			var newEvent = new Event({
				  title: eventInput.title,
				  description: eventInput.description,
				  lat: eventInput.lat,
				  lng: eventInput.lng,
				  startDate: eventInput.startDate,
				  endDate: eventInput.endDate
			});
			newEvent.save(function(err){
				if(err) console.log(err);
			});
			channel.events.push(newEvent);
			channel.save(function(err, product, numAffected) {
				  var response = {};
				  if (err){  
					  response.success = false;
					  response.message = "Error occured. Entry not added";
				  }
				  else{
					  response.success = true;
				  }
				  res.setHeader('Content-Type', 'application/json');
				  res.end(JSON.stringify(response));
				})
		}
	})
}

function setup(app,mong) {
	Event = mong.model('Event');
	Channel = mong.model('Channel');
	app.post('/event/getAllEventsWithinRange', getAllEventsWithinRange);
	app.post('/event/addOne', createEvent);
}

module.exports = setup;

