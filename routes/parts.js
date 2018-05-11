var express = require('express');
var router = express.Router();
var part_controller = require('../controllers/partController');

//get all parts
router.get('/', part_controller.part_list);

//create a part
router.post('/', part_controller.part_create);

//get part by id
router.get('/:id', part_controller.part_detail);

//delete part by id
router.delete('/:id', part_controller.part_delete);

//update part
router.put('/:id', part_controller.part_update);

module.exports = router;
