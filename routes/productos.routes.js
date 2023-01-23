const { Router } = require('express');
const router = Router();
const productosCtrl = require('../controllers/productos.controller');

router.get('/productos', productosCtrl.index);
router.get('/productos/list', productosCtrl.listProductos);
router.get('/productos/list/:nombre', productosCtrl.listProductosProveedor);
router.get('/productos/find/:id', productosCtrl.getProductos);
router.post('/productos/create', productosCtrl.createProductos);
router.put('/productos/edit/:id', productosCtrl.editProductos);
router.delete('/productos/delete/:id', productosCtrl.deleteProductos);

router.get('/rubros/list', productosCtrl.listRubros);

module.exports = router;
