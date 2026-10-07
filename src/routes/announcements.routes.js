const express = require('express');
const router = express.Router();
const Controller = require('../controllers/announcement.controller');

router.get('/', Controller.getAll);
router.get('/:id', Controller.getById);
router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.patch('/:id', Controller.patch);
router.delete('/:id', Controller.remove);
module.exports = router;
