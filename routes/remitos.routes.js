const { Router } = require('express');
const router = Router();
const remitosCtrl = require('../controllers/remitos.controller');

router.get('/remitos', remitosCtrl.index);
router.get('/remitos/list', remitosCtrl.listRemitos);
//lista remitos por id > hbs
router.get('/remitos/list/:id', remitosCtrl.listRemitosCliente);
//lista remitos por id > json
router.get('/remitos/get/:id', remitosCtrl.getRemitosCliente);
//remitos por id > hbs+json
router.get('/remitos/find/:id/:pos', remitosCtrl.getRemito);
router.post('/remitos/create', remitosCtrl.createRemitos);
router.put('/remitos/add/:id', remitosCtrl.addRemito);
router.put('/remitos/edit/:id', remitosCtrl.editRemitos);
router.delete('/remitos/delete/:id', remitosCtrl.deleteRemitos);

module.exports = router;
