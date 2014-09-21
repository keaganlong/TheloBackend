var Channel;

function getAllChannels(req, res) {
	Channel.find(function(err,channels){
		if(err){
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ success:false  }));
			return;
		}
		else{
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ channels:channels  }));
		}
	});
}

function addOneChannel(req, res) {
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	var channel = req.body;
	var channelName = channel["name"];
	var newChannel = new Channel({
		name: channelName,
		comments: []
	});
	
	newChannel.save(function(err, product, numAffected) {
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
	Channel = mong.model('Channel');
	app.get('/channel/getAll', getAllChannels);
	app.post('/channel/addOne', addOneChannel);
}

module.exports = setup;