const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const upload = require('../middlewares/upload');

router.get('/', publicController.index);
router.get('/offre/:id', publicController.show);
router.post('/postuler/:id', upload.single('cv'), publicController.apply);
router.get('/admin/dashboard', publicController.dashboard);

module.exports = router;