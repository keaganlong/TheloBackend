var Event;
var Channel;

function getAllEventsWithinRange(req, res) {
	var input = req.body;
	var lat = input.lat;
	var lng = input.lng;
	var range = input.range;
	Event.find(function(err,events){
		if(err){
			
		}
		else{
			var filteredEvents = filterEventsByLatLndRange(events,lat,lng,range);
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ events:filteredEvents  }));
		}
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
	var description = req.params.eventDescription || "";
	var newEvent = new Event({
		  title: req.params.eventTitle,
		  description: description,
		  lat: req.params.lat,
		  lng: req.params.lng,
		  startDate: req.params.startEPOC,
		  endDate: req.params.endEPOC,
		  comments: []
	});
	
	newEvent.save(function(err, product, numAffected) {
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
	});
}

function setup(app,mong) {
	Event = mong.model('Event');
	Channel = mong.model('Channel');
	app.post('/events/getAllEventsWithinRange', getAllEventsWithinRange);
	app.post('/event/:eventTitle/:lat/:lng/:startEPOC/:endEPOC/:eventDescription?', createEvent);
}

module.exports = setup;

