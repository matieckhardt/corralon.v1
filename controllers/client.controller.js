const clientCtrl = {};
const Client = require("../models/Cliente");

clientCtrl.index = (req, res) => {
  res.render("clientes", { active: { clientes: true } });
};
clientCtrl.pagos = (req, res) => {
  res.render("pagos", { active: { pagos: true } });
};

clientCtrl.listClients = async (req, res) => {
  const clientList = await Client.find();
  res.json(clientList);
};

clientCtrl.findOneClient = async (req, res) => {
  const { id } = req.params;
  const clientFound = await Client.findById(id).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  res.status(200).json(clientFound);
};

clientCtrl.getClient = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  client.active = { panelClientes: true };
  res.render("panelClientes", client);
};

clientCtrl.createClient = async (req, res) => {
  try {
    const cliente = ({
      nombre,
      RazonSocial,
      email,
      tel,
      fiscal,
      localidad,
      address,
      dni,
      observaciones,
    } = req.body);
    const newClient = new Client(cliente);
    await newClient.save();
    return false;
  } catch (error) {
    res.status(500).send("There was a problem registering the client");
  }
};

clientCtrl.editClient = async (req, res) => {
  try {
    const clientEdited = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!clientEdited) {
      return res.status(204).json({ message: "client not found" });
    } else {
      return res.json(clientEdited);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("There was a problem editing the client");
  }
};

clientCtrl.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const clientDeleted = await Client.findByIdAndDelete(id);
    if (!clientDeleted) {
      return res.status(204).json({ message: "client not found" });
    } else {
      return res.json(clientDeleted);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("There was a problem deleting the client");
  }
};

module.exports = clientCtrl;
