const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

// Define routes and map them to controller functions
router.get('/products', dataController.getData);
router.post('/', dataController.createData);

module.exports = router;
