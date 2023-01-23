const ProductosCtrl = {};
const Producto = require("../models/Producto");
const Rubro = require("../models/Rubro");

ProductosCtrl.index = (req, res) => {
  res.render("productos", { active: { productos: true } });
};

ProductosCtrl.listProductos = async (req, res) => {
  const productosList = await Producto.find();
  res.json(productosList);
};

ProductosCtrl.listProductosProveedor = async (req, res) => {
  const proveedor = req.params.nombre;
  const productosList = await Producto.find();
  const listaFiltrada = productosList.filter(
    (producto) => producto.proveedor === proveedor
  );
  res.json(listaFiltrada);
};

ProductosCtrl.listRubros = async (req, res) => {
  const rubrosList = await Rubro.find();
  res.json(rubrosList);
};

ProductosCtrl.getProductos = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findById(id).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  res.json(producto);
};

ProductosCtrl.createProductos = async (req, res) => {
  try {
    const { proveedor, nombre, marca, precio, rubro, iva } = req.body;
    const productos = new Producto({
      proveedor,
      nombre,
      marca,
      precio,
      iva,
      rubro,
      historial: (Producto.historial = { precio, update: Date() }),
    });
    await productos.save();
    res.status(200).json({ message: "producto creado" });
  } catch (error) {
    res.status(500).send("There was a problem registering the productos");
  }
};

ProductosCtrl.editProductos = async (req, res) => {
  try {
    const productosEdited = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!productosEdited) {
      return res.status(204).json({ message: "productos not found" });
    } else {
      return res.json(productosEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("There was a problem editing the productos");
  }
};

ProductosCtrl.deleteProductos = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const productosDeleted = await Producto.findByIdAndDelete(id);
    if (!productosDeleted) {
      return res.status(204).json({ message: "productos not found" });
    } else {
      return res.json(productosDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There was a problem deleting the productos");
  }
};

module.exports = ProductosCtrl;
