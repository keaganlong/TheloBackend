var Comment;
var Event;

function addCommentToEvent(req, res){
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	function validate(body){
		if(!(body && body.eventId && body.body && body.eventId)){
			return false;
		}
		return true;
	}
	
	var input = req.body;
	
	if(!(validate(input))){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Bad body input." }));
		return;
	}
	
	var bodyText = input.body;
	var postTime = input.postTime;
	var eventId = input.eventId;
	
	var newComment = new Comment({
		  body: bodyText,
		  postTime: postTime,
		  _eventId: eventId
	});
	
	Event.findOne({_id:eventId}, function(err,event){
		if(err || !event){
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ success:false, message:"Event not found or internal error." }));
		    return;
		}
		else{
			event.comments.push(newComment);
			newComment.save();
			event.save();
		}
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:true }));
	});
}

function getAllByEventId(){
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
	if(!(validate(input))){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Bad body input." }));
		return;
	}
	
	var eventId = input.eventId;
	Event.findOne({_id:eventId}, function(err,event){
		if(err || !event){
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ success:false, message:"Event not found or internal error." }));
		    return;
		}
		else{
			var comments = event.comments;
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ comments:comments  }));
		}
	});
}

function setup(app,mong) {
	Comment = mong.model('User');
	Event = mong.model('Event');
	app.get('/comment/getAllByEventId', getAllByEventId);
	app.post('/comment/addCommentToEvent', addCommentToEvent)
}

module.exports = setup;