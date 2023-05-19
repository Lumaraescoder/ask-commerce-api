var express = require('express');
var router = express.Router();

const category = require('../controllers/category');


router.get('/', category.getAllCategories);
router.get('/:id', category.getCategory);
router.post('/', category.addCategory);
router.delete('/:id', category.deleteCategory);
router.put('/:id', category.editCategory);

module.exports = router;