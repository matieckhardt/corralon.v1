const proveedoresCtrl = {};
const Proveedor = require('../models/Proveedor');

proveedoresCtrl.index = (req, res) => {
  res.render('proveedores', { active: { proveedores: true } });
};

proveedoresCtrl.listProveedores = async (req, res) => {
  const proveedoresList = await Proveedor.find();
  res.json(proveedoresList);
};

proveedoresCtrl.getProveedor = async (req, res) => {
  const { id } = req.params;
  const proveedor = await Proveedor.findById(id).catch(function (err) {
    console.error('Error en la consulta de ID');
  });
  res.json(proveedor);
};

proveedoresCtrl.getProveedores = async (req, res) => {
  const { id } = req.params;
  const proveedores = await Proveedor.findById(id).catch(function (err) {
    console.error('Error en la consulta de ID');
  });
  res.render('proveedores', proveedores);
};

proveedoresCtrl.createProveedores = async (req, res) => {
  try {
    const {
      nombre,
      razonSocial,
      tipo,
      cuit,
      fiscal,
      address,
      localidad,
      tel,
      contacto,
    } = req.body;
    const prov = new Proveedor({
      nombre,
      razonSocial,
      tipo,
      cuit,
      fiscal,
      address,
      localidad,
      tel,
      contacto,
    });
    await prov.save();
    return false;
  } catch (error) {
    res.status(500).send('There was a problem registering the Proveedor');
  }
};

proveedoresCtrl.editProveedores = async (req, res) => {
  try {
    const proveedorEdited = await Proveedor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!proveedorEdited) {
      return res.status(204).json({ message: 'proveedor not found' });
    } else {
      return res.json(proveedorEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('There was a problem editing the proveedor');
  }
};

proveedoresCtrl.deleteProveedores = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const proveedorDeleted = await Proveedor.findByIdAndDelete(id);
    if (!proveedorDeleted) {
      return res.status(204).json({ message: 'proveedor not found' });
    } else {
      return res.json(proveedorDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('There was a problem deleting the proveedor');
  }
};

module.exports = proveedoresCtrl;
