const Compras = require("../models/Compras");
const Pagos = require("../models/Pagos");
const Ventas = require("../models/Ventas");
const filterYearMonth = require("../helpers/filterYearMonth");
const year = new Date().getFullYear();
const month = new Date().getMonth();

const summaryCtrl = {
  metodosPago(req, res) {
    Pagos.aggregate([
      {
        $group: {
          _id: "$metodoDePago",
          cantidad: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          metodo: "$_id",
          cantidad: 1,
        },
      },
      {
        $sort: {
          cantidad: -1,
        },
      },
    ])
      .exec()
      .then((data) => res.json(data))
      .catch((err) =>
        res.status(500).json({ error: "Internal server error." })
      );
  },

  tiposComprobante(req, res) {
    Ventas.aggregate([
      {
        $group: {
          _id: "$comprobante",
          cantidad: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          tipo: "$_id",
          cantidad: 1,
        },
      },
      {
        $sort: {
          cantidad: -1,
        },
      },
    ])
      .exec()
      .then((data) => res.json(data))
      .catch((err) =>
        res.status(500).json({ error: "Internal server error." })
      );
  },

  productosVendidos(req, res) {
    const { year, month } = req.dateParams;
    Ventas.aggregate([
      {
        $match: filterYearMonth(year, month),
      },
      {
        $project: {
          "materialesVendidos.cantidad": 1,
          "materialesVendidos.mercaderia": 1,
          "materialesVendidos.subtotal": 1,
        },
      },
      {
        $unwind: {
          path: "$materialesVendidos",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$materialesVendidos",
        },
      },
      {
        $group: {
          _id: "$mercaderia",
          ventas: {
            $push: {
              cantidad: "$cantidad",
              subtotal: "$subtotal",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          mercaderia: "$_id",
          ventas: 1,
        },
      },
    ])
      .exec()
      .then((data) => res.json(data))
      .catch((err) =>
        res.status(500).json({ error: "Internal server error." })
      );
  },

  totalVendido(req, res) {
    Ventas.aggregate([
      {
        $group: {
          _id: null,
          totalVendido: {
            $sum: "$precioTotal",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalVendido: 1,
        },
      },
    ])
      .exec()
      .then((data) => res.json(data[0]))
      .catch((err) =>
        res.status(500).json({ error: "Internal server error." })
      );
  },

  mejoresClientes(req, res) {
    const { year, month } = req.dateParams;
    Ventas.aggregate([
      {
        $match: {
          ...filterYearMonth(year, month),
          cliente: {
            $nin: ["Cliente Generico", "Generico"],
          },
        },
      },
      {
        $project: {
          cliente: 1,
          precioTotal: 1,
        },
      },
      {
        $group: {
          _id: "$cliente",
          totalVendido: {
            $sum: "$precioTotal",
          },
        },
      },
      {
        $project: {
          _id: 0,
          cliente: "$_id",
          totalVendido: 1,
        },
      },
      {
        $sort: {
          totalVendido: -1,
        },
      },
    ])
      .exec()
      .then((data) => res.json(data))
      .catch((err) =>
        res.status(500).json({ error: "Internal server error." })
      );
  },

  productosComprados(req, res) {
    const { year, month } = req.dateParams;
    Compras.aggregate([
      {
        $match: filterYearMonth(year, month),
      },
      {
        $project: {
          "productos.nombreProducto": 1,
          "productos.cantidad": 1,
          "productos.subtotal": 1,
        },
      },
      {
        $unwind: {
          path: "$productos",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$productos",
        },
      },
      {
        $group: {
          _id: "$nombreProducto",
          cantidadComprada: {
            $sum: "$cantidad",
          },
          subtotalComprado: {
            $sum: "$subtotal",
          },
        },
      },
      {
        $project: {
          _id: 0,
          producto: "$_id",
          cantidadComprada: 1,
          subtotalComprado: 1,
        },
      },
      {
        $sort: {
          cantidadComprada: -1,
        },
      },
    ])
      .exec()
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: "Internal server error" }));
  },

  totalComprado(req, res) {
    const { year, month } = req.dateParams;
    Compras.aggregate([
      {
        $match: filterYearMonth(year, month),
      },
      {
        $group: {
          _id: null,
          totalComprado: {
            $sum: "$montoTotal",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalComprado: 1,
        },
      },
    ])
      .exec()
      .then((data) => res.json(data[0]))
      .catch((err) => res.status(500).json({ error: "Internal server error" }));
  },

  mejoresProveedores(req, res) {
    const { year, month } = req.dateParams;
    Compras.aggregate([
      {
        $match: filterYearMonth(year, month),
      },
      {
        $project: {
          proveedor: 1,
          montoTotal: 1,
        },
      },
      {
        $group: {
          _id: "$proveedor",
          totalComprado: {
            $sum: "$montoTotal",
          },
        },
      },
      {
        $project: {
          _id: 0,
          proveedor: "$_id",
          totalComprado: 1,
        },
      },
      {
        $sort: {
          totalComprado: -1,
        },
      },
    ])
      .exec()
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: "Internal server error" }));
  },
};

module.exports = summaryCtrl;
