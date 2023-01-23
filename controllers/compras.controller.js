const comprasCtrl = {};
const Compras = require("../models/Compras");

comprasCtrl.index = (req, res) => {
  res.render("compras", { active: { compras: true } });
};

comprasCtrl.listCompras = async (req, res) => {
  const fecha = req.params;
  const comprasList = await Compras.find({
    fechaFc: { $regex: req.params.list },
  });
  res.json(comprasList);
};

comprasCtrl.getCompras = async (req, res) => {
  const { id } = req.params;
  const comprado = await Compras.findById(id).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  res.render("comprado", comprado);
};

comprasCtrl.createCompras = async (req, res) => {
  try {
    const {
      proveedor,
      razonSocial,
      tipoProveedor,
      condicionFiscal,
      cuit,
      comprobante,
      factura,
      fechaFc,
      productos,
      observaciones,
      montoTotal,
      ivaTotal,
    } = req.body;
    const compras = new Compras({
      proveedor,
      razonSocial,
      tipoProveedor,
      condicionFiscal,
      cuit,
      comprobante,
      factura,
      fechaFc,
      productos,
      observaciones,
      montoTotal,
      ivaTotal,
    });
    await compras.save();
    return res.status(201).json({ message: "compra creada" });
  } catch (error) {
    res.status(500).send("There was a problem registering the compras");
  }
};

comprasCtrl.editCompras = async (req, res) => {
  try {
    const comprasEdited = await Compras.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!comprasEdited) {
      return res.status(204).json({ message: "compras not found" });
    } else {
      return res.json(comprasEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("There was a problem editing the compras");
  }
};

comprasCtrl.deleteCompras = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const comprasDeleted = await Compras.findByIdAndDelete(id);
    if (!comprasDeleted) {
      return res.status(204).json({ message: "compras not found" });
    } else {
      return res.json(comprasDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There was a problem deleting the compras");
  }
};

module.exports = comprasCtrl;
