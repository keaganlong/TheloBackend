
function setup(mongoose) {
	var UserModel = {
			  deviceId: {type:String, required:true,unique:true},
			  channels: [{ type: mongoose.Schema.ObjectId, ref: 'Channel' }]
		};
	var userSchema = new mongoose.Schema(UserModel);
	mongoose.model('User', userSchema);
}

module.exports = setup;