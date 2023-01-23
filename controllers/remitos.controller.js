const remitosCtrl = {};
const Remitos = require("../models/Remito");

remitosCtrl.index = (req, res) => {
  res.render("remitos");
};

remitosCtrl.listRemitos = async (req, res) => {
  const remitosList = await Remitos.find().lean();
  res.render("listaRemitos", remitosList);
};

remitosCtrl.listRemitosCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const listaRemitos = await Remitos.findById(id)
      .lean()
      .catch(function (err) {
        console.error("Error en la consulta del cliente ID");
      });
    res.render("listaRemitos", listaRemitos);
  } catch (err) {
    console.log(err);
  }
};

remitosCtrl.getRemitosCliente = async (req, res) => {
  const { id } = req.params;
  const remitosList = await Remitos.findById(id).lean();
  res.json(remitosList);
};

remitosCtrl.getRemito = async (req, res) => {
  try {
    let customRemito;
    const { id, pos } = req.params;
    const remitoObtenido = await Remitos.findById(id)
      .lean()
      .catch(function (err) {
        console.error("Error en la consulta de ID");
      });
    console.log(remitoObtenido);
    if (remitoObtenido) {
      customRemito = remitoObtenido.listaRemitos[pos];
    } else {
      customRemito = {};
      customRemito["remitoId"] = "-1";
    }
    customRemito["empresa"] = {
      razonSocial: "Corralon Bianchi",
      domicilio: "Marqués de Avilés 3265",
      cuit: "20-20392641-4",
    };
    customRemito.remitoId == undefined
      ? (customRemito.remitoId = "falta ID")
      : customRemito.remitoId;
    customRemito.remitoId = customRemito.remitoId.toString().padStart(6, "0");
    console.log("jona boton");
    res.render("remitos", customRemito);
  } catch (error) {
    res
      .status(500)
      .send("There was a problem registering the remito: " + error);
  }
};

remitosCtrl.createRemitos = async (req, res) => {
  try {
    const remitoData = ({
      cliente,
      clienteId,
      ventaId,
      acopioId,
      listaRemitos,
    } = req.body);
    const remitoNew = new Remitos(remitoData);
    await remitoNew.save();
    return res.status(201).json(remitoNew._id);
  } catch (error) {
    res.status(500).send("There was a problem registering the Remitos");
  }
};

remitosCtrl.editRemitos = async (req, res) => {
  console.log("edit: ", req.params.id, "/n body: ", req.body);
  try {
    const remitoEdited = await Remitos.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    console.log(remitoEdited);
    if (!remitoEdited) {
      return res.status(204).json({ message: "remito not found" });
    } else {
      return res.json(remitoEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("There was a problem editing the remito");
  }
};

remitosCtrl.addRemito = async (req, res) => {
  let remitoEdited;
  console.log("entro");
  try {
    remitoEdited = await Remitos.findByIdAndUpdate(
      req.params.id,
      {
        $push: { listaRemitos: req.body },
      },
      {
        new: true,
      }
    );
    return res.status(200).json(remitoEdited);
  } catch (error) {
    console.error(error);
    return res.status(500).send("There was a problem editing the remito");
  }
};

remitosCtrl.deleteRemitos = async (req, res) => {
  try {
    const { id } = req.params;
    const presupuestoDeleted = await Remitos.findByIdAndDelete(id);
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

module.exports = remitosCtrl;
