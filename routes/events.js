var Event;
var Channel;
var User;

function getAllEventsWithinRange(req, res) {
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	function validate(body){
		if(!(body && body.range && body.channelName)){
			return false;
		}
		return true;
	}
	var input = req.body;
	if(!validate(input)){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Bad body input." }));
		return;
	}
	var lat = input.lat;
	var lng = input.lng;
	var range = input.range;
	var channelName = input.channelName;
	Channel.findOne({name:channelName}).populate('events').exec(function(err,channel){
		if(!channel || err){
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ success:false, message:"Channel not found or internal error." }));
		    return;
		}
		var filteredEvents = filterEventsByTime(filterEventsByLatLngRange(channel.events,lat,lng,range));
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ events:filteredEvents  }));
	});
}

function filterEventsByTime(events){
	var output = [];
	var d = new Date();
	var currTime = d.getTime() / 1000;
	for(var i = 0; i<events.length;i++){
		if(events[i].endDate > currTime){
			output.push(events[i]);
		}
	}
	return output;
}

function filterEventsByLatLngRange(events,lat,lng,range){
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

/**
 * TODO: Bhavya
 * @param candidateEvent, potential event trying to be added
 * @param events, list of current events already in DB
 * @return, alreadyExists, boolean. True if the same/similar event is already present in events. False otherwise
 */
function eventExistsInList(candidateEvent,events){
	//If event found in events in same channel as candidate, within X meters of candidate, and same/similar title and or description as candidate. Return true.
	//use getDistanceBetweenTwoPoints to get meter distance
	// refer to models/Event for properties of an event
	return false;
}

function createEvent(req, res) {
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	function validate(body){
		if(!(body.channelName&&body.title && body.startDate && body.endDate)){
			return false;
		}
		return true;
	}
	
	var eventInput = req.body;
	
	if(!validate(eventInput)){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Bad body input." }));
	    return;
	}
	
	var channelName = eventInput.channelName;

	Channel.findOne({ name: channelName }).populate('events').exec(function(err,channel){

		if(!channel || err){
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ success:false, message:"Channel not found or internal error." }));
		    return;
		}
		else{
			var newEvent = new Event({
				  title: eventInput.title,
				  description: eventInput.description,
				  lat: eventInput.lat,
				  lng: eventInput.lng,
				  startDate: eventInput.startDate,
				  endDate: eventInput.endDate,
				  _channelId: channel._id,
				  comments: []
			});
			if(eventExistsInList(newEvent,channel.events)){
				res.setHeader('Content-Type', 'application/json');
			    res.end(JSON.stringify({ success:false, message:"(Same) Event already posted." }));
				return;
			}
			channel.events.push(newEvent);
			newEvent.save(function(err){
				if(err){
					res.setHeader('Content-Type', 'application/json');
				    res.end(JSON.stringify({ success:false, message:"Error saving event." }));
				}
			});
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

function addIntentUser(req, res){
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	function validate(body){
		if(!(body && body.deviceId && body.eventId)){
			return false;
		}
		return true;
	}
	
	var input = req.body;
	
	if(!validate(input)){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Bad body input." }));
	    return;
	}
	
	var deviceId = input.deviceId;
	var eventId = input.eventId;
	
	Event.findOne({_id:eventId}, function(err, event){
		if(err || !event){
			return;
		}
		else{
			var intentUsers = event.intentUsers;
			var add = true;
			for(var i = 0; i<intentUsers.length && add;i++){
				if(intentUsers[i].deviceId===deviceId){
					add = false;
				}
			}
			if(add){
				User.findOne({deviceId:deviceId}, function(err, user){
					if(err || !user){
						return;
					}
					else{
						intentUsers.push(user);
						event.save();
						res.setHeader('Content-Type', 'application/json');
					    res.end(JSON.stringify({ success:true }));
					}
				});
			}
		}	
	});
}

function getNumberIntentUsersForEvent(req, res){
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	function validate(body){
		if(!(body && body.eventId)){
			return false;
		}
		return true;
	}
	
	var input = req.body;
	
	if(!validate(input)){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Bad body input." }));
	    return;
	}
	
	var eventId = input.eventId;
	Event.findOne({_id:eventId}, function(err, event){
		if(err || !event){
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ success:false, message:"No event found" }));
			return;
		}
		else{
			var count = event.intentUsers.length;
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ count:count }));
		}
	});
}

function addArrivedUser(){
	
}

function setup(app,mong) {
	Event = mong.model('Event');
	Channel = mong.model('Channel');
	User = mong.model('User');
	app.post('/event/getAllEventsWithinRange', getAllEventsWithinRange);
	app.post('/event/addOne', createEvent);
	app.post('/event/addIntentUser', addIntentUser);
	app.post('/event/getNumberIntentUsersForEvent',getNumberIntentUsersForEvent);
	app.post('/event/addArrivedUser', addArrivedUser);
}

module.exports = setup;

