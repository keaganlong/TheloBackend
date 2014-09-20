
function setup(mongoose) {
	var ChannelModel = {
			  name: String,
			  events: [{ type: mongoose.Schema.ObjectId, ref: 'Event' }]
		};
	var channelSchema = new mongoose.Schema(ChannelModel);
	mongoose.model('Channel', channelSchema);
}

module.exports = setup;