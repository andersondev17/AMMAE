// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
/* const { protect, authorize } = require('../middleware/auth'); */
const { generateInventoryReport, getReports, getReport, getReportAsXML, deleteReport } = require('../controllers/reportController');

router.use(protect);

// Rutas específicas para cada tipo de reporte
router.post('/inventory', generateInventoryReport);

router.route('/')
    .get(getReports);

router.route('/:id')
    .get(getReport)
    .delete(authorize('admin'), deleteReport);

router.get('/:id/xml', getReportAsXML);

module.exports = router;