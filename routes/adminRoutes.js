const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/offres', adminController.index);
router.get('/offres/create', adminController.createView);
router.post('/offres/create', adminController.create);
router.get('/offres/edit/:id', adminController.editView);
router.post('/offres/edit/:id', adminController.update);
router.post('/offres/delete/:id', adminController.delete);

module.exports = router;