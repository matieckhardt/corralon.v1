const comprobantesCtrl = {};
const Comprobantes = require("../models/Comprobantes");
const Cliente = require("../models/Cliente");
const Ventas = require("../models/Ventas");

comprobantesCtrl.index = (req, res) => {
  try {
    res.render("comprobantes", { active: { comprobantes: true } });
  } catch (err) {
    console.log(err);
  }
};

comprobantesCtrl.listComprobantes = async (req, res) => {
  const fecha = req.params;
  const comprobantesList = await Ventas.find({
    fecha: { $regex: req.params.list },
  });
  res.json(comprobantesList);
};

comprobantesCtrl.getComprobantes = async (req, res) => {
  const { id } = req.params;
  const comprobante = await Comprobantes.findById(id).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  console.log(comprobante);
  res.render("comprobantes", comprobante);
};

comprobantesCtrl.createComprobantes = async (req, res) => {
  try {
    const comprob = ({
      numeroComp,
      fechaComp,
      tipoFc,
      clienteNombre,
      clienteCuit,
      clienteTel,
      clienteDomicilio,
      clienteCF,
      productos,
      subTotal,
      descuentos,
      total,
      bultos,
    } = req.body);
    const newComprobante = new Comprobantes(comprob);
    console.log(newComprobante);
    await newComprobante.save();
    return false;
  } catch (error) {
    res.status(500).send("There was a problem registering the Comprobantes");
  }
};

comprobantesCtrl.editComprobantes = async (req, res) => {
  try {
    const comprobanteEdited = await Comprobantes.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!comprobanteEdited) {
      return res.status(204).json({ message: "comprobante not found" });
    } else {
      return res.json(comprobanteEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("There was a problem editing the comprobante");
  }
};

comprobantesCtrl.deleteComprobantes = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const comprobanteDeleted = await Comprobantes.findByIdAndDelete(id);
    if (!comprobanteDeleted) {
      return res.status(204).json({ message: "comprobante not found" });
    } else {
      return res.json(comprobanteDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There was a problem deleting the comprobante");
  }
};

module.exports = comprobantesCtrl;
