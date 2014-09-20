var Channel;

function getChannels(req, res) {
	Channel.find(function(err,channels){
		if(err){
			
		}
		else{
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ channels:channels  }));
		}
	});
}

function createChannel(req, res) {
	var newChannel = new Channel({
		name: req.params.channelName
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
	app.get('/channel', getChannels);
	app.post('/channel/:channelName', createChannel);
}

module.exports = setup;