const remitosCtrl = {};
const Remitos = require('../models/Comprobantes');

remitosCtrl.index = async (req, res) => {
  const today = new Date();
  const validUntil = new Date(new Date().getTime() + 15 * 24 * 3600000);
  const response = {
    active: { remitos: true },
    empresa: {
      razonSocial: 'Corralon Bianchi',
      domicilio: 'Marqués de Avilés 3265',
      cuit: '23-33787660-9',
      fecha: today.toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      fechaValidez: validUntil.toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    },
    comprobante: {
      tipoFc: '',
      subTotal: '',
      descuentos: '',
      total: '',
      fechaComp: '',
      numeroComp: '',
      bultos: '',
    },
    cliente: {
      cuit: '',
      domicilio: '',
      nombre: '',
      condicionFiscal: '',
    },
  };
  response.comprobante['tipoFc'] = 'X';
  response.comprobante['subTotal'] = '345000';
  response.comprobante['descuentos'] = '45000';
  response.comprobante['total'] = '300000';
  response.comprobante['bultos'] = '300';
  response.comprobante['fechaComp'] = '12/12/2021';
  response.comprobante['numeroComp'] = '0001-1234';
  response.cliente['cuit'] = '2020202020202';
  response.cliente['domicilio'] = 'domic 1234';
  response.cliente['nombre'] = 'Matias';
  response.cliente['condicionFiscal'] = 'Monotributista';
  res.render('remitos', response);
};

remitosCtrl.listRemitos = async (req, res) => {
  const remitosList = await Remitos.find();
  res.json(remitosList);
};

remitosCtrl.getRemitosCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const listaRemitos = await Remitos.find({ clienteId: id }).catch(function (
      err
    ) {
      console.error('Error en la consulta del cliente ID');
    });
    res.json(listaRemitos);
  } catch (err) {
    console.log(err);
  }
};

remitosCtrl.getRemitos = async (req, res) => {
  const { id } = req.params;
  const remitos = await Remitos.findById(id).catch(function (err) {
    console.error('Error en la consulta de ID');
  });
  console.log(remitos);
  const response = {
    active: { remitos: true },
    empresa: {
      razonSocial: 'Corralon Bianchi',
      domicilio: 'Marqués de Avilés 3265',
      cuit: '23-33787660-9',
      fecha: remitos.fechaComp,
      fechaValidez: new Date(remitos.fechaComp).setDate(remitos.fechaComp + 15),
    },
    comprobante: {
      tipoFc: remitos.tipoFc,
      productos: remitos.productos,
      subTotal: remitos.subTotal,
      descuentos: remitos.descuentos,
      total: remitos.total,
      fechaComp: remitos.fechaComp,
      numeroComp: remitos.numeroComp.toString().padStart(6, '0'),
      bultos: remitos.bultos,
    },
    cliente: {
      cuit: remitos.clienteCuit,
      domicilio: remitos.clienteDomicilio,
      nombre: remitos.clienteNombre,
      condicionFiscal: remitos.clienteCF,
    },
  };
  res.render('remitos', response);
};

remitosCtrl.createRemitos = async (req, res) => {
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
    const prov = new Remitos({
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
    res.status(500).send('There was a problem registering the Remitos');
  }
};

remitosCtrl.editRemitos = async (req, res) => {
  try {
    const proveedorEdited = await Remitos.findByIdAndUpdate(
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

remitosCtrl.deleteRemitos = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const proveedorDeleted = await Remitos.findByIdAndDelete(id);
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

module.exports = remitosCtrl;
