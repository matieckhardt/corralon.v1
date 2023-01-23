const { Router } = require('express');
const router = Router();
const pagoCtrl = require('../controllers/pagos.controller');

router.get('/pagos', pagoCtrl.index);
router.get('/pagos/list', pagoCtrl.listPago);
router.get('/pagos/find/:id', pagoCtrl.getPago);
router.get('/pagos/getPagoCliente/:id', pagoCtrl.getPagoCliente);
router.post('/pagos/create', pagoCtrl.createPago);
router.put('/pagos/edit/:id', pagoCtrl.editPago);
router.delete('/pagos/delete/:id', pagoCtrl.deletePago);

module.exports = router;
