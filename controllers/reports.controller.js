const reportsCtrl = {};
const Compras = require("../models/Compras");
const Ventas = require("../models/Ventas");
const Comprobantes = require("../models/Comprobantes");
const today = new Date();

reportsCtrl.reports = async (req, res) => {
  try {
    return res.render("reports");
  } catch (error) {
    return res.status(404).json(error);
  }
};

reportsCtrl.openingBalance = async (req, res) => {
  try {
    const data = await Ventas.aggregate([
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
          precioTotal: 1,
          yearMonth: 1,
        },
      },
    ]);
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

reportsCtrl.purchasesProd = async (req, res) => {
  try {
    const data = await Compras.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date("Sat, 01 Jan 2022 03:00:00 GMT"),
            $lt: new Date("Wed, 01 Feb 2023 03:00:00 GMT"),
          },
          tipoProveedor: "Productivo",
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          montoTotal: {
            $toDecimal: "$montoTotal",
          },
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
          montoTotal: {
            $sum: "$montoTotal",
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
          montoTotal: 1,
          yearMonth: 1,
        },
      },
    ]);

    return res.json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

reportsCtrl.purchasesNoProd = async (req, res) => {
  try {
    const data = await Compras.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date("Sat, 01 Jan 2022 03:00:00 GMT"),
            $lt: new Date("Wed, 01 Feb 2023 03:00:00 GMT"),
          },
          tipoProveedor: {
            $regex: "No Productivo",
          },
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          montoTotal: {
            $toDecimal: "$montoTotal",
          },
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
          montoTotal: {
            $sum: "$montoTotal",
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
          montoTotal: 1,
        },
      },
    ]);

    return res.json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

reportsCtrl.purchasesTaxes = async (req, res) => {
  try {
    const data = await Compras.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date("Sat, 01 Jan 2022 03:00:00 GMT"),
            $lt: new Date("Wed, 01 Feb 2023 03:00:00 GMT"),
          },
          tipoProveedor: {
            $regex: "Impuestos",
          },
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          montoTotal: {
            $toDecimal: "$montoTotal",
          },
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
          montoTotal: {
            $sum: "$montoTotal",
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
          montoTotal: 1,
        },
      },
    ]);

    return res.json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

reportsCtrl.discountMonth = async (req, res) => {
  try {
    const data = await Comprobantes.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date("Sat, 01 Jan 2022 03:00:00 GMT"),
            $lt: new Date("Wed, 01 Feb 2023 03:00:00 GMT"),
          },
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          descuentos: {
            $toDecimal: "$descuentos",
          },
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
          descuentos: {
            $sum: "$descuentos",
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
          descuentos: 1,
        },
      },
    ]);

    return res.json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
};

module.exports = reportsCtrl;
