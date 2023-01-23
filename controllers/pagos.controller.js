const pagoCtrl = {};
const Pago = require("../models/Pagos");

pagoCtrl.index = (req, res) => {
  res.render("pagos", { active: { pagos: true } });
};

pagoCtrl.listPago = async (req, res) => {
  const pagoList = await Pago.find();
  res.json(pagoList);
};

pagoCtrl.getPago = async (req, res) => {
  const { id } = req.params;
  res.render("pagos", { clienteId: id });
};

pagoCtrl.getPagoCliente = async (req, res) => {
  const { id } = req.params;
  const pagosList = await Pago.find({ clienteId: id }).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  res.json(pagosList);
};

pagoCtrl.createPago = async (req, res) => {
  try {
    const pagoData = ({
      fecha,
      cliente,
      clienteId,
      nroComprobante,
      fechaCheque,
      numCheque,
      metodoDePago,
      observaciones,
      monto,
      comision,
    } = req.body);
    const pagoCreado = new Pago(pagoData);
    await pagoCreado.save();
    return res.status(201).json(pagoCreado);
  } catch (error) {
    res.status(500).send("There was a problem registering the pago");
  }
};

pagoCtrl.editPago = async (req, res) => {
  try {
    const pagoEdited = await Pago.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pagoEdited) {
      return res.status(204).json({ message: "pago not found" });
    } else {
      return res.json(pagoEdited);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("There was a problem editing the pago");
  }
};

pagoCtrl.deletePago = async (req, res) => {
  try {
    const { id } = req.params;
    const pagoDeleted = await Pago.findByIdAndDelete(id);
    if (!pagoDeleted) {
      return res.status(204).json({ message: "pago not found" });
    } else {
      return res.json(pagoDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There was a problem deleting the pago");
  }
};

module.exports = pagoCtrl;
