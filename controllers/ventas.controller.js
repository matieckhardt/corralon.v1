const ventasCtrl = {};
const Ventas = require("../models/Ventas");
const day = new Date().getDay();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const anioMesRegex = `${year}-${month.toString().padStart(2, "0")}`;
const anio = `${year.toString().padStart(2, "0")}`;

ventasCtrl.index = (req, res) => {
  res.render("ventas", { active: { ventas: true } });
};

ventasCtrl.listVentas = async (req, res) => {
  const ventasList = await Ventas.find();
  res.json(ventasList);
};

ventasCtrl.getVentas = async (req, res) => {
  const { id } = req.params;
  const ventas = await Ventas.find({ clienteId: id }).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  res.json(ventas);
};

ventasCtrl.getVenta = async (req, res) => {
  const { id } = req.params;
  const venta = await Ventas.findById(id).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  res.json(venta);
};

ventasCtrl.createVentas = async (req, res) => {
  try {
    const venta = ({
      acopioId,
      cliente,
      clienteId,
      clienteCuit,
      clienteTel,
      clienteObse,
      comision,
      comprobante,
      comprobanteId,
      remitoId,
      descuento,
      faltaAcopio,
      fecha,
      materialesVendidos,
      precioTotal,
      presupuesto,
    } = req.body);
    const newVenta = new Ventas(venta);
    await newVenta.save();
    return res.status(201).json(newVenta);
  } catch (error) {
    res.status(500).send("There was a problem registering the ventas");
  }
};

ventasCtrl.editVentas = async (req, res) => {
  try {
    const ventasEdited = await Ventas.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!ventasEdited) {
      return res.status(204).json({ message: "ventas not found" });
    } else {
      return res.json(ventasEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("There was a problem editing the ventas");
  }
};

ventasCtrl.deleteVentas = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const ventasDeleted = await Ventas.findByIdAndDelete(id);
    if (!ventasDeleted) {
      return res.status(204).json({ message: "ventas not found" });
    } else {
      return res.json(ventasDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There was a problem deleting the ventas");
  }
};

module.exports = ventasCtrl;
