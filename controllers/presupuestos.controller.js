const presupuestosCtrl = {};
const Presupuestos = require("../models/Comprobantes");

presupuestosCtrl.index = (req, res) => {
  res.render("presupuestos", response);
};

presupuestosCtrl.listPresupuestos = async (req, res) => {
  const presupuestosList = await Presupuestos.find();
  res.json(presupuestosList);
};

presupuestosCtrl.getPresupuestos = async (req, res) => {
  const { id } = req.params;
  const presupuestos = await Presupuestos.findOne({ comprobanteId: id }).catch(
    function (err) {
      console.error("Error en la consulta de ID");
    }
  );
  presupuestos["empresa"] = {
    razonSocial: "Corralon Bianchi",
    domicilio: "Marqués de Avilés 3265",
    cuit: "20-20392641-4",
  };
  presupuestos.comprobanteId = presupuestos.comprobanteId
    .toString()
    .padStart(6, "0");
  presupuestos.horaEmision = presupuestos.createdAt.toLocaleTimeString();
  console.log(presupuestos);

  res.render("presupuestos", presupuestos);
};

presupuestosCtrl.createPresupuestos = async (req, res) => {
  try {
    const presupuestoData = ({
      fechaComp,
      fechaValidez,
      tipoFc,
      clienteNombre,
      clienteCuit,
      clienteTel,
      clienteDomicilio,
      clienteObse,
      clienteCF,
      productos,
      subTotal,
      descuentos,
      total,
    } = req.body);
    const presupNew = new Presupuestos(presupuestoData);
    await presupNew.save();
    return res.status(201).json({ comprobanteId: presupNew.comprobanteId });
  } catch (error) {
    res.status(500).send("There was a problem registering the Presupuestos");
  }
};

presupuestosCtrl.editPresupuestos = async (req, res) => {
  try {
    const presupuestoEdited = await Presupuestos.findOneAndUpdate(
      { comprobanteId: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (!presupuestoEdited) {
      return res.status(204).json({ message: "presupuesto not found" });
    } else {
      return res.json(presupuestoEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("There was a problem editing the presupuesto");
  }
};

presupuestosCtrl.deletePresupuestos = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const presupuestoDeleted = await Presupuestos.findByIdAndDelete(id);
    if (!presupuestoDeleted) {
      return res.status(204).json({ message: "presupuesto not found" });
    } else {
      return res.json(presupuestoDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There was a problem deleting the presupuesto");
  }
};

module.exports = presupuestosCtrl;
