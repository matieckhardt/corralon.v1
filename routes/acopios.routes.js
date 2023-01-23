const { Router } = require('express');
const router = Router();
const acopioCtrl = require('../controllers/acopio.controller');

router.get('/acopio', acopioCtrl.index);
router.get('/acopios', acopioCtrl.allAcopios);
router.get('/acopio/list', acopioCtrl.listAcopio);
router.get('/acopio/list/:id', acopioCtrl.getAcopioCliente);
router.get('/acopio/find/:id', acopioCtrl.getAcopio);
router.post('/acopio/create', acopioCtrl.createAcopio);
router.put('/acopio/edit/:id', acopioCtrl.editAcopio);
router.delete('/acopio/delete/:id', acopioCtrl.deleteAcopio);

module.exports = router;
