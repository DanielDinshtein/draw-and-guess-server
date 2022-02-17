const User = require("../../models/userModel");

async function loginUser(username) {

	if (!username) {
		return { emptyUsername: true };
	}

    

	return User.find({ name: username }).then((users) => {
		if (users.length === 0) {
			const user = new User({ name: username });
			return user.save();
		} else {
			console.log(users);
			return { invalidUsername: true };
		}
	});
}
exports.loginUser = loginUser;
