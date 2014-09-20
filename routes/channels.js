var Channel;

function getAllChannels(req, res) {
	Channel.find(function(err,channels){
		if(err){
			
		}
		else{
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ channels:channels  }));
		}
	});
}

function addOneChannel(req, res) {
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