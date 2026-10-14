const express = require('express');
const router = express.Router();
const Controller = require('../controllers/announcement.controller');
const asyncHandler = require('./async-handler');

router.get('/', asyncHandler(Controller.getAll));
router.get('/:id', asyncHandler(Controller.getById));
router.post('/', asyncHandler(Controller.create));
router.put('/:id', asyncHandler(Controller.update));
router.patch('/:id', asyncHandler(Controller.patch));
router.delete('/:id', asyncHandler(Controller.remove));
module.exports = router;
