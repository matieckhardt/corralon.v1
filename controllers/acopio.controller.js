const acopioCtrl = {};
const Acopio = require("../models/Acopio");

acopioCtrl.index = (req, res) => {
  try {
    res.render("acopio", { active: { acopio: true } });
  } catch (err) {
    console.log(err);
  }
};

acopioCtrl.allAcopios = (req, res) => {
  try {
    res.render("acopios", { active: { acopios: true } });
  } catch (err) {
    console.log(err);
  }
};

acopioCtrl.listAcopio = async (req, res) => {
  try {
    const acopioList = await Acopio.find();
    res.json(acopioList);
  } catch (err) {
    console.log(err);
  }
};

acopioCtrl.getAcopio = async (req, res) => {
  try {
    const { id } = req.params;
    const acopioFound = await Acopio.findById(id).catch(function (err) {
      console.error("Error en la consulta de ID");
    });
    res.render("acopio", acopioFound);
  } catch (err) {
    console.log(err);
  }
};

acopioCtrl.getAcopioCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const listaAcopio = await Acopio.find({ clienteId: id }).catch(function (
      err
    ) {
      console.error("Error en la consulta del cliente ID");
    });
    res.json(listaAcopio);
  } catch (err) {
    console.log(err);
  }
};

acopioCtrl.createAcopio = async (req, res) => {
  try {
    const acopio = ({
      cliente,
      clienteId,
      clienteCuit,
      clienteTel,
      ventaId,
      materialesAcopio,
    } = req.body);
    const newAcopio = new Acopio(acopio);
    await newAcopio.save();
    return res.status(201).json(newAcopio._id);
  } catch (error) {
    res.status(500).send("There was a problem registering the acopio");
  }
};

acopioCtrl.editAcopio = async (req, res) => {
  const { materialesAcopio, materialesRetirados, ventaId } = req.body;
  try {
    let acopioEdited;
    if (materialesAcopio) {
      let vaciado = { faltaAcopio: true, ventaId };
      if (materialesAcopio.filter((e) => e.cantidadFaltante != 0).length == 0) {
        vaciado = { faltaAcopio: false, ventaId };
      }
      acopioEdited = await Acopio.findByIdAndUpdate(
        req.params.id,
        {
          materialesAcopio,
          $push: { materialesRetirados: materialesRetirados },
        },
        {
          new: true,
        }
      );
      if (!acopioEdited) {
        return res.status(204).json({ message: "acopio not found" });
      } else {
        console.log("materialesAcopio: ", materialesAcopio);
        console.log("materialesRetirados: ", materialesRetirados);
        console.log("acopioEdited: ", acopioEdited);
        console.log("vaciado: ", vaciado);
        return res.status(200).json(vaciado);
      }
    } else {
      acopioEdited = await Acopio.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    }
    if (!acopioEdited) {
      return res.status(204).json({ message: "acopio not found" });
    } else {
      return res.status(200).json(acopioEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("There was a problem editing the acopio");
  }
};

acopioCtrl.deleteAcopio = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const acopioDeleted = await Acopio.findByIdAndDelete(id);
    if (!acopioDeleted) {
      return res.status(204).json({ message: "acopio not found" });
    } else {
      return res.json(acopioDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There was a problem deleting the acopio");
  }
};

module.exports = acopioCtrl;
