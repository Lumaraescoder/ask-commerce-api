var express = require('express');
var router = express.Router();

const user = require('../controller/user');

router.post('/',user.addUser);
router.get('/',user.getAllUsers);
//router.get('/:id',user.getUser);
//router.delete('/:id',user.deleteUser);

module.exports = router;
