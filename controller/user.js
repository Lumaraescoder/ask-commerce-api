const User = require('../model/user');


module.exports.getAllUsers = async (req, res) => {

	try {
		const users = await User.find()
		res.json(users);

	} catch (err) {
		console.log(err);
		res.status(500).json({message: "error fetching all users."});
	}
}


module.exports.addUser = async (req, res) => {
	try {
		const { email, username, password, firstName, lastName} = req.body;
		if(!email || !username || !password || !firstName || !lastName){
			return res.status(400).json({ message: "something's missing", status: "Error"});
		}

		const existingUser = await User.findOne({email});

		if(existingUser){
			return res.status(400).json({ message: "email already exists", status: "Error"});
		}

		const user = await User.create({
			email,
			username,
			password,
			firstName,
			lastName
		});

		res.json(user);

			
	} catch (err){

		res.status(500).json({message: "error creating a user"});
	}
}
