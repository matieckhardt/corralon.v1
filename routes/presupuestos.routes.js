const { Router } = require('express');
const router = Router();
const presupuestosCtrl = require('../controllers/presupuestos.controller');

router.get('/presupuestos', presupuestosCtrl.index);
router.get('/presupuestos/list', presupuestosCtrl.listPresupuestos);
router.get('/presupuestos/find/:id', presupuestosCtrl.getPresupuestos);
router.post('/presupuestos/create', presupuestosCtrl.createPresupuestos);
router.put('/presupuestos/edit/:id', presupuestosCtrl.editPresupuestos);
router.delete('/presupuestos/delete/:id', presupuestosCtrl.deletePresupuestos);

module.exports = router;
