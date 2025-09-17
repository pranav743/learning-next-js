const express = require('express');
const ImageController = require('../controllers/imageController');

const router = express.Router();

router.get('/:filename', ImageController.serveImage);

module.exports = router;