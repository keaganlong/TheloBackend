var ChannelModel = {
	  name: { type: String }
};

function setup(mongoose) {
	var channelSchema = new mongoose.Schema(ChannelModel);
	mongoose.model('Channel', channelSchema);
}

module.exports = setup;