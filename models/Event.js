var EventModel = {
	  title: String,
	  description: String,
	  lat: Number,
	  lng: Number,
	  startDate: Number,
	  endDate: Number,
	  comments: Array
};

function setup(mongoose) {
	var eventSchema = new mongoose.Schema(EventModel);
	mongoose.model('Event', eventSchema);
}

module.exports = setup;