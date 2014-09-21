var User;
var Channel;

function updateUserChannels(req,res){
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	function validate(body){
		if(!(body && body.deviceId && body.channelsToSub && body.channelsToUnsub)){
			return false;
		}
		return true;
	}
	
	var input = req.body;
	var deviceId = input.deviceId;
	var channelsToSub = input.channelsToSub;
	var channelsToUnsub = input.channelsToUnsub;

	if(!validate(input)){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Bad body or input" }));
		return;
	}
	else{
		User.findOne({deviceId:deviceId}).populate('channels').exec(function(err,user){
			if(!user || err){
				res.setHeader('Content-Type', 'application/json');
			    res.end(JSON.stringify({ success:false, message:"Channel not found or internal error." }));
			    return;
			}
			else{
				var userChannels = user.channels;
				for(var i = 0; i<userChannels.length;i++){
					var currChannel = userChannels[i];
					var currChannelName = currChannel.name;
					if(channelsToUnsub.indexOf(currChannelName)!=-1){
						userChannels.remove(currChannel);
						user.save();
					}
				}
				for(var j = 0; j<channelsToSub.length;j++){
					var channelNameToAdd = channelsToSub[j];
					var add = true;
					
					for(var k = 0; k<userChannels.length && add;k++){
						if(userChannels[k].name===channelNameToAdd){
							add = false;
						}	
					}
					if(add){
						Channel.findOne({name:channelNameToAdd},function(err,channel){
							if(!err && channel){
								userChannels.push(channel);
								user.save();
							}
						});
					}
				}
				res.setHeader('Content-Type', 'application/json');
			    res.end(JSON.stringify({ success:true }));
				return;
			}
		});
	}
}

function getAllUsers(req, res){
	User.find(function(err,users){
		if(err){
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ success:false  }));
			return;
		}
		else{
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ users:users  }));
		}
	});
}

function getSubscribedChannels(req,res){
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	function validate(body){
		if(!(body && body.deviceId)){
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
	
	var deviceId = input.deviceId;
	User.findOne({deviceId:deviceId}).populate('channels').exec(function(err,user){
		if(!user || err){
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ success:false, message:"Channel not found or internal error." }));
		    return;
		}
		else{
			var userChannels = user.channels;
			res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ channels:userChannels  }));
		}
	});
}

function addOneUser(req,res){
	if(req.get('Content-Type')!='application/json'){
		res.setHeader('Content-Type', 'application/json');
	    res.end(JSON.stringify({ success:false, message:"Content-Type must be application/json" }));
		return;
	}
	function validate(body){
		if(!(body && body.deviceId)){
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
	
	var deviceId = input.deviceId;
	var newUser = new User({
		deviceId:deviceId,
		channels:[]
	});
	newUser.save(function(err, product, numAffected) {
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
	User = mong.model('User');
	Channel = mong.model('Channel');
	app.get('/user/getAll', getAllUsers);
	app.post('/user/getSubscribedChannels', getSubscribedChannels);
	app.post('/user/addOne', addOneUser);
	app.post('/user/updateUserChannels', updateUserChannels);
}

module.exports = setup;

