function setup(mongoose) {
	var EventModel = {
			  title: String,
			  description: String,
			  lat: Number,
			  lng: Number,
			  startDate: Number,
			  endDate: Number,
			  _channelId: { type: mongoose.Schema.ObjectId, ref: 'Channel' }
		};
	var eventSchema = new mongoose.Schema(EventModel);
	mongoose.model('Event', eventSchema);
}

module.exports = setup;