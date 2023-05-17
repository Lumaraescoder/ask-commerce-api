const User = require('../models/user');

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'error fetching all users.' });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select();

    if (!user) {
      res.status(404).json({ message: 'failed to get user' });
    } else {
      res.json(user);
    }
  } catch (err) {
    console.log('getUser ->', err);
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;
    if (!email || !username || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "something's missing", status: 'Error' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'email already exists', status: 'Error' });
    }

    const user = await User.create({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'error creating a user' });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id == null) {
      res.json({
        status: 'error',
        message: 'cart id should be provided',
      });
    } else {
      const user = await User.deleteOne({ _id: req.params.id });
      res.json(user);
    }
  } catch (err) {
    console.log('getUser ->', err);
  }
};

module.exports.editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body);
    res.json(user);
  } catch (err) {
    console.log('editUser error -> ', err);
  }
};
