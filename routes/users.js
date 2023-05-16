var express = require('express');
var router = express.Router();

const user = require('../controller/user');


router.get('/', user.getAllUsers);
router.get('/:id', user.getUser);
router.post('/', user.addUser);
router.delete('/:id', user.deleteUser);
router.put('/:id', user.editUser);

module.exports = router;
