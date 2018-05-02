var express = require('express');
var router = express.Router();
var song_controller = require('../controllers/songController');

//get all songs
router.get('/', song_controller.song_list);

//create song
router.post('/', song_controller.song_create);

//get song by id
router.get('/:id', song_controller.song_detail);

//delete song by id
router.delete('/:id', song_controller.song_delete);

//update song
router.put('/:id', song_controller.song_update);

module.exports = router;