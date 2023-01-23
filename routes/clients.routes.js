const { Router } = require('express');
const router = Router();
const clientCtrl = require('../controllers/client.controller');

router.get('/clientes', clientCtrl.index);
router.get('/clientes/list', clientCtrl.listClients);
router.get('/clientes/findOne/:id', clientCtrl.findOneClient);
router.get('/clientes/find/:id', clientCtrl.getClient);
router.post('/clientes/create', clientCtrl.createClient);
router.put('/clientes/edit/:id', clientCtrl.editClient);
router.delete('/clientes/delete/:id', clientCtrl.deleteClient);

module.exports = router;
