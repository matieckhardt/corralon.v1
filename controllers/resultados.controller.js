const resultadosCtrl = {};
const Resultados = require("../models/Resultados");
const Compras = require("../models/Compras");
const Ventas = require("../models/Ventas");
const Comprobantes = require("../models/Comprobantes");
const Pagos = require("../models/Pagos");
const Rubro = require("../models/Rubro");

const day = new Date().getDay();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const anioMesRegex = `${year}-${month.toString().padStart(2, "0")}`;
const anio = `${year.toString().padStart(2, "0")}`;

// suma todo los totales de las ventas del mes

resultadosCtrl.totalVendidoMes = async (req, res) => {
  try {
    let ac = 0;
    const data = await Ventas.find({
      fecha: { $regex: new RegExp(anio) },
    });
    const meses = data.map(({ fecha, precioTotal, presupuesto }) => ({
      Mes: new Date(fecha).toLocaleString("es-ar", { month: "short" }),
      precioTotal: precioTotal,
      presupuesto,
    }));
    const venta = meses.filter(function (element) {
      return element.presupuesto === false;
    });
    const junio = venta.filter(function (element) {
      return element.Mes === "jun";
    });
    const sumas = venta.reduce(
      (a, { Mes, precioTotal }) => ((a[Mes] = (a[Mes] || 0) + +precioTotal), a),
      {}
    );
    return sumas;
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.totalBonif = async (req, res) => {
  try {
    let ac = 0;
    const data = await Comprobantes.find({
      fechaComp: { $regex: new RegExp(anio) },
    });
    const meses = data.map(({ createdAt, descuentos }) => ({
      Mes: new Date(createdAt).toLocaleString("es-ar", { month: "short" }),
      descuentos,
    }));
    const sumas = meses.reduce(
      (a, { Mes, descuentos }) => ((a[Mes] = (a[Mes] || 0) + +descuentos), a),
      {}
    );
    return sumas;
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.totalProd = async (req, res) => {
  try {
    let ac = 0;
    const data = await Compras.find({
      fechaFc: { $regex: new RegExp(anio) },
    });
    const prod = data.filter(
      ({ tipoProveedor }) => tipoProveedor == "Productivo"
    );
    const meses = prod.map(({ fechaFc, montoTotal }) => ({
      Mes: new Date(fechaFc).toLocaleString("es-ar", { month: "short" }),
      montoTotal,
    }));

    const sumas = meses.reduce(
      (a, { Mes, montoTotal }) => ((a[Mes] = (a[Mes] || 0) + +montoTotal), a),
      {}
    );
    return sumas;
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.totalNoProd = async (req, res) => {
  try {
    let ac = 0;
    const data = await Compras.find({
      fechaFc: { $regex: new RegExp(anio) },
    });
    const noProd = data.filter(
      ({ tipoProveedor }) => tipoProveedor == "No Productivo"
    );

    const meses = noProd.map(({ fechaFc, montoTotal }) => ({
      Mes: new Date(fechaFc).toLocaleString("es-ar", { month: "short" }),
      montoTotal,
    }));
    const sumas = meses.reduce(
      (a, { Mes, montoTotal }) => ((a[Mes] = (a[Mes] || 0) + +montoTotal), a),
      {}
    );
    return sumas;
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.resultados = async (req, res) => {
  try {
    const resultados = await Resultados.find().lean();
    const datos = resultados[0];
    res.render("resultados", datos);

    const ventas = await resultadosCtrl.totalVendidoMes();
    const boni = await resultadosCtrl.totalBonif();
    const gasPro = await resultadosCtrl.totalProd();
    const gasNoPro = await resultadosCtrl.totalNoProd();

    const data = { ventas, boni, gasPro, gasNoPro };
    const dashUpdate = await Resultados.findByIdAndUpdate(
      "62cb912886709b27b04e48d5",
      data
    );
    console.log("Resultados cargados OK");
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.cementoMeses = async (req, res) => {
  try {
    const today = new Date();
    const arrayCementos = await Ventas.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date("Sat, 01 Jan 2022 03:00:00 GMT"),
            $lt: new Date(today),
          },
          presupuesto: false,
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          "materialesVendidos.mercaderia": 1,
          "materialesVendidos.cantidad": 1,
        },
      },
      {
        $unwind: {
          path: "$materialesVendidos",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "materialesVendidos.mercaderia": {
            $regex: new RegExp("emento"),
          },
        },
      },
      {
        $project: {
          mercaderia: "$materialesVendidos.mercaderia",
          cantidad: "$materialesVendidos.cantidad",
          createdAt: "$createdAt",
        },
      },
      {
        $addFields: {
          year: {
            $toString: {
              $year: "$createdAt",
            },
          },
          month: {
            $toString: {
              $month: "$createdAt",
            },
          },
        },
      },
      {
        $addFields: {
          yearMonth: {
            $concat: ["$year", "-", "$month"],
          },
        },
      },
      {
        $group: {
          _id: {
            $toDate: "$yearMonth",
          },
          cantidad: {
            $sum: {
              $toInt: "$cantidad",
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $addFields: {
          year: {
            $toString: {
              $year: "$_id",
            },
          },
          month: {
            $toString: {
              $month: "$_id",
            },
          },
        },
      },
      {
        $addFields: {
          yearMonth: {
            $concat: ["$year", "-", "$month"],
          },
        },
      },
      {
        $project: {
          _id: 0,
          yearMonth: 1,
          cantidad: 1,
        },
      },
    ]);
    const mapeoCant = arrayCementos.map(({ cantidad }) => cantidad);

    const mapeoYear = arrayCementos.map(({ yearMonth }) => yearMonth);

    let graphData = [];
    const mapeo = graphData.push(mapeoCant) && graphData.push(mapeoYear);

    return res.json(graphData);
  } catch (error) {
    return res.status(404).json(error);
  }
};

resultadosCtrl.ventaMeses = async (req, res) => {
  try {
    const today = new Date();
    const arrayVendido = await Ventas.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date("Sat, 01 Jan 2022 03:00:00 GMT"),
            $lt: new Date(today),
          },
          presupuesto: false,
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          precioTotal: 1,
        },
      },
      {
        $addFields: {
          year: {
            $toString: {
              $year: "$createdAt",
            },
          },
          month: {
            $toString: {
              $month: "$createdAt",
            },
          },
        },
      },
      {
        $addFields: {
          yearMonth: {
            $concat: ["$year", "-", "$month"],
          },
        },
      },
      {
        $group: {
          _id: {
            $toDate: "$yearMonth",
          },
          precioTotal: {
            $sum: "$precioTotal",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $addFields: {
          year: {
            $toString: {
              $year: "$_id",
            },
          },
          month: {
            $toString: {
              $month: "$_id",
            },
          },
        },
      },
      {
        $addFields: {
          yearMonth: {
            $concat: ["$year", "-", "$month"],
          },
        },
      },
      {
        $project: {
          _id: 0,
          yearMonth: 1,
          precioTotal: 1,
        },
      },
    ]);
    const mapeoVentas = arrayVendido.map(({ precioTotal }) => precioTotal);

    const mapeoYear = arrayVendido.map(({ yearMonth }) => yearMonth);

    let graphData = [];
    const mapeo = graphData.push(mapeoVentas) && graphData.push(mapeoYear);

    return res.json(graphData);
  } catch (error) {
    return res.status(404).json(error);
  }
};

module.exports = resultadosCtrl;
