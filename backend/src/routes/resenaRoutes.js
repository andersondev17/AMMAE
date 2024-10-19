
const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
const {
    getResenas,
    getResena,
    createResena,
    updateResena,
    deleteResena
} = require('../controllers/resenaController');

router
    .route('/')
    .get(getResenas)
    .post(protect, authorize('usuario', 'admin'), createResena);

router
    .route('/:id')
    .get(getResena)
    .put(protect, authorize('usuario', 'admin'), updateResena)
    .delete(protect, authorize('usuario', 'admin'), deleteResena);

module.exports = router;

