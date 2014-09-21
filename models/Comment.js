
function setup(mongoose) {
	var CommentModel = {
			  body: {type:String, required:true},
			  postTime: Number,
			  _eventId: { type: mongoose.Schema.ObjectId, ref: 'Event' }
		};
	var commentSchema = new mongoose.Schema(CommentModel);
	mongoose.model('Comment', commentSchema);
}

module.exports = setup;