const migraCtrl = {};
const Material = require("../models/Materiales");
const Compras = require("../models/Compras");
const Ventas = require("../models/Ventas");
const Clientes = require("../models/Cliente");
const Clients = require("../models/Client");
const Industries = require("../models/Industries");
const Supplier = require("../models/Supplier");
const Acopios = require("../models/Acopio");
const Pagos = require("../models/Pagos");
const Proveedores = require("../models/Proveedor");
const Productos = require("../models/Producto");
const Rubros = require("../models/Rubro");
const Acopio = require("../models/Acopio");

migraCtrl.materialMigra = async (req, res) => {
  const migraList = await Material.aggregate([
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "industries",
          localField: "rubro",
          foreignField: "name",
          as: "industry",
        },
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          name: "$nombre",
          vatMultiplier: {
            $toDecimal: "0.21",
          },
          vat: {
            $toDecimal: "21.00",
          },
          price: {
            $toDecimal: "$precio",
          },
          netPrice: {
            $round: [
              {
                $divide: [
                  {
                    $toDecimal: "$precio",
                  },
                  {
                    $toDecimal: "1.21",
                  },
                ],
              },
              2,
            ],
          },
          priceList: "SI",
          industry: {
            $cond: {
              if: {
                $and: [
                  { $eq: [{ $type: "$industry" }, "array"] },
                  { $ne: [{ $size: "$industry" }, 0] },
                ],
              },
              then: { $arrayElemAt: ["$industry", 0] },
              else: {
                name: "Sin Rubro",
                category: "Sin Categoria",
              },
            },
          },
        },
    },
  ]);

  res.json(migraList);
};

migraCtrl.clientesMigra = async (req, res) => {
  const migraList = await Clientes.aggregate([
    {
      $project: {
        _id: 1,
        name: "$nombre",
        legalName: "$RazonSocial",
        docNro: "$dni",
        taxCategory: "$fiscal",
        city: "$localidad",
        address: "$address",
        phoneNumber: "$tel",
        mailAddress: "$email",
        notes: "$observaciones",
      },
    },
    {
      $addFields: {
        docTipo: {
          $cond: {
            if: {
              $eq: [
                {
                  $strLenCP: "$docNro",
                },
                11,
              ],
            },
            then: "80",
            else: "96",
          },
        },
        name: {
          $cond: {
            if: {
              $eq: ["$name", ""],
            },
            then: "$legalName",
            else: "$name",
          },
        },
        legalName: {
          $cond: {
            if: {
              $eq: ["$legalName", ""],
            },
            then: "$name",
            else: "$legalName",
          },
        },
      },
    },
    {
      $match: {
        $and: [
          {
            name: {
              $ne: "",
            },
          },
          {
            legalName: {
              $ne: "",
            },
          },
          {
            docTipo: {
              $in: ["80", "96"],
            },
          }, // docTipo validation
        ],
      },
    },
    {
      $out: "clients",
    },
  ]);
  console.log("collection clients actualizada");
  const clients = await Clients.find();
  res.json(clients);
};

migraCtrl.rubrosMigra = async (req, res) => {
  const migraList = await Rubros.aggregate([
    {
      $project: {
        name: "$nombre",
        category: "$tipo",
      },
    },
    {
      $out: "industries",
    },
  ]);
  const industries = await Industries.find();
  res.json(industries);
};

migraCtrl.proveedoresMigra = async (req, res) => {
  const migraList = await Proveedores.aggregate([
    {
      $project: {
        name: "$nombre",
        legalName: "$razonSocial",
        category: "$tipo",
        docNro: "$cuit",
        taxCategory: "$fiscal",
        city: "$localidad",
        address: null,
        phoneNumber: "$tel",
        representative: "$contacto",
      },
    },
    {
      $out: "suppliers",
    },
  ]);

  console.log("collection supplier actualizada");
  const supplier = await Supplier.find();

  res.json(supplier);
};

migraCtrl.productosMigra = async (req, res) => {
  const migraList = await Productos.aggregate([
    {
      $lookup: {
        from: "rubros",
        localField: "rubro",
        foreignField: "nombre",
        as: "industry",
      },
    },
    {
      $lookup: {
        from: "supplier",
        localField: "proveedor",
        foreignField: "name",
        as: "proveedor",
      },
    },
    {
      $project: {
        name: "$nombre",
        brand: "$marca",
        price: {
          $toDecimal: "$precio",
        },
        vat: {
          $toDecimal: "$iva",
        },
        supplier: {
          $first: "$proveedor",
        },
        industry: {
          $first: "$industry",
        },
      },
    },
    {
      $project: {
        name: 1,
        brand: 1,
        price: 1,
        vat: 1,
        supplier: 1,
        industry: {
          name: "$industry.nombre",
          category: "$industry.tipo",
          _id: "$industry._id",
        },
      },
    },
    {
      $addFields: {
        industry: {
          $cond: [
            { $eq: ["$industry", {}] }, // Check if industry is empty (an empty array)
            {
              name: "Otros",
              category: "No Productivo",
              _id: { $toObjectId: "61e0800c555112c1bd0b4066" },
            },
            "$industry", // Keep the original industry if not empty
          ],
        },
      },
    },
  ]);

  res.json(migraList);
};

migraCtrl.comprasMigra = async (req, res) => {
  const migraList = await Compras.aggregate([
    {
      $lookup: {
        from: "rubros",
        localField: "rubro",
        foreignField: "nombre",
        as: "industry",
      },
    },
    {
      $lookup: {
        from: "suppliers",
        localField: "proveedor",
        foreignField: "name",
        as: "supplier",
      },
    },
    {
      $project: {
        notes: "$observaciones",
        invoiceType: "$comprobante",
        invoiceNumber: "$factura",
        emissionDate: "$createdAt",
        upfrontVatMultiplier: {
          $toDecimal: 0,
        },
        incomeTaxMultiplier: {
          $toDecimal: 0,
        },
        upfrontVatTotal: {
          $toDecimal: 0,
        },
        incomeTaxTotal: {
          $toDecimal: 0,
        },
        vatTotal: {
          $toDecimal: "$ivaTotal",
        },
        netTotal: {
          $toDecimal: "$montoTotal",
        },
        supplier: {
          $first: "$supplier",
        },
        products: "$productos",
      },
    },
    {
      $unwind: {
        path: "$products",
      },
    },
    {
      $project: {
        notes: 1,
        invoiceType: 1,
        invoiceNumber: 1,
        emissionDate: 1,
        upfrontVatMultiplier: 1,
        incomeTaxMultiplier: 1,
        upfrontVatTotal: 1,
        incomeTaxTotal: 1,
        vatTotal: 1,
        netTotal: 1,
        supplier: 1,
        products: {
          name: "$products.nombreProducto",
          amount: "$products.cantidad",
          price: {
            $toDecimal: "$products.precio",
          },
          vatMultiplier: {
            $toDecimal: "$products.porcentajeIVA",
          },
          vatTotal: {
            $round: [
              {
                $toDecimal: "$products.montoIVA",
              },
              2,
            ],
          },
          netTotal: {
            $round: [
              {
                $toDecimal: "$products.subtotal",
              },
              2,
            ],
          },
          impTotal: {
            $round: [
              {
                $toDecimal: "$products.subtotal",
              },
              2,
            ],
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        products: {
          $push: "$products",
        },
        invoiceType: {
          $first: "$invoiceType",
        },
        invoiceNumber: {
          $first: "$invoiceNumber",
        },
        emissionDate: {
          $first: "$emissionDate",
        },
        upfrontVatMultiplier: {
          $first: "$upfrontVatMultiplier",
        },
        incomeTaxMultiplier: {
          $first: "$incomeTaxMultiplier",
        },
        upfrontVatTotal: {
          $first: "$upfrontVatTotal",
        },
        incomeTaxTotal: {
          $first: "$incomeTaxTotal",
        },
        vatTotal: {
          $first: "$vatTotal",
        },
        netTotal: {
          $first: "$netTotal",
        },
        supplier: {
          $first: "$supplier",
        },
      },
    },
    {
      $project: {
        notes: 1,
        invoiceType: 1,
        invoiceNumber: 1,
        emissionDate: 1,
        paymentMethod: "Efectivo",
        upfrontVatMultiplier: 1,
        incomeTaxMultiplier: 1,
        upfrontVatTotal: 1,
        incomeTaxTotal: 1,
        vatTotal: 1,
        impTotal: "$netTotal",
        products: 1,
        otherTaxes: {
          $toDecimal: "0",
        },
        supplier: 1,
      },
    },
    {
      $match: {
        supplier: {
          $ne: null,
        },
      },
    },
    {
      $sort: {
        supplier: 1,
      },
    },
  ]);

  res.json(migraList);
};

migraCtrl.ventasMigraSinGen = async (req, res) => {
  const migraList = await Ventas.aggregate([
    {
      $match: {
        clienteId: {
          $ne: "0",
        },
      },
    },
    {
      $project: {
        invoiceType: {
          $cond: {
            if: {
              $eq: ["$presupuesto", true],
            },
            then: "Presupuesto",
            else: {
              $cond: {
                if: {
                  $in: ["$comprobante", ["A", "B"]],
                },
                then: "Comprobante en linea",
                else: "$comprobante",
              },
            },
          },
        },
        invoiceNumber: "$comprobanteId",
        materials: [
          {
            name: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: [
                        { $arrayElemAt: ["$materialesVendidos.mercaderia", 0] },
                        "",
                      ],
                    },
                    {
                      $eq: [
                        { $arrayElemAt: ["$materialesVendidos.mercaderia", 0] },
                        null,
                      ],
                    },
                  ],
                },
                then: "0 name",
                else: { $arrayElemAt: ["$materialesVendidos.mercaderia", 0] },
              },
            },
            price: {
              $toDecimal: {
                $toString: {
                  $arrayElemAt: ["$materialesVendidos.precioFacturado", 0],
                },
              },
            },
            amount: {
              $toDouble: { $arrayElemAt: ["$materialesVendidos.cantidad", 0] },
            },
            bonusPercentage: { $toInt: "0" },
            bonusImport: { $toDecimal: "0" },
            bonusSubtotal: { $toDecimal: "0" },
            surchargePercentage: { $toInt: "0" },
            surchargeImport: { $toDecimal: "0" },
            surchargeSubtotal: { $toDecimal: "0" },
            aliquot: { $toInt: "21" },
            iva: {
              $toDecimal: {
                $multiply: [
                  {
                    $toDecimal: {
                      $arrayElemAt: ["$materialesVendidos.subtotal", 0],
                    },
                  },
                  0.21,
                ],
              },
            },
            subtotalWithIva: {
              $toDecimal: {
                $toString: {
                  $arrayElemAt: ["$materialesVendidos.subtotal", 0],
                },
              },
            },
            total: {
              $toDecimal: {
                $toString: {
                  $arrayElemAt: ["$materialesVendidos.subtotal", 0],
                },
              },
            },
          },
        ],
        paymentMethod: "Efectivo",
        emissionDate: "$createdAt",
        ptoVta: {
          $toInt: "99",
        },
        cbteTipo: null,
        concepto: null,
        docTipo: "$clienteCF",
        docNro: "$clienteCuit",
        client: {
          $toObjectId: "$clienteId",
        },
        impTotal: {
          $toDecimal: "$precioTotal",
        },
        impTotConc: {
          $toDecimal: 0,
        },
        impNeto: {
          $toDecimal: {
            $divide: ["$precioTotal", 1.21],
          },
        },
        impOpEx: {
          $toDecimal: 0,
        },
        impIVA: {
          $toDecimal: {
            $multiply: ["$precioTotal", 0.21],
          },
        },
        impTrib: {
          $toDecimal: 0,
        },
        iva: [
          {
            Id: { $toInt: "5" },
            BaseImp: {
              $toDecimal: {
                $divide: ["$precioTotal", 1.21],
              },
            },
            Importe: {
              $toDecimal: {
                $multiply: ["$precioTotal", 0.21],
              },
            },
          },
        ],
        store: {
          _id: {
            $toObjectId: "$acopioId" || null,
          },
          completed: {
            $cond: {
              if: {
                $eq: ["$faltaAcopio", true],
              },
              then: false,
              else: true,
            },
          },
        },
        cbteDesde: null,
        cbteHasta: null,
        afipStatus: {
          $toBool: 0,
        },
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: {
        path: "$client",
      },
    },
  ]);

  res.json(migraList);
};

migraCtrl.ventasMigraGen = async (req, res) => {
  const migraList = await Ventas.aggregate([
    {
      $match: {
        clienteId: "0",
      },
    },
    {
      $project: {
        migrado: {
          $toBool: 1,
        },
        invoiceType: {
          $cond: {
            if: {
              $eq: ["$presupuesto", true],
            },
            then: "Presupuesto",
            else: {
              $cond: {
                if: {
                  $in: ["$comprobante", ["A", "B"]],
                },
                then: "Comprobante en linea",
                else: "$comprobante",
              },
            },
          },
        },
        invoiceNumber: {
          $cond: {
            if: {
              $eq: [
                {
                  $type: "$comprobanteId",
                },
                "missing",
              ], // Check if invoiceNumber doesn't exist
            },

            then: 0,
            // If it doesn't exist, set it to "0"
            else: "$comprobanteId", // If it exists, use the value of comprobanteId
          },
        },
        materials: [
          {
            name: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: [
                        { $arrayElemAt: ["$materialesVendidos.mercaderia", 0] },
                        "",
                      ],
                    },
                    {
                      $eq: [
                        { $arrayElemAt: ["$materialesVendidos.mercaderia", 0] },
                        null,
                      ],
                    },
                  ],
                },
                then: "0 name",
                else: { $arrayElemAt: ["$materialesVendidos.mercaderia", 0] },
              },
            },
            price: {
              $toDecimal: {
                $toString: {
                  $arrayElemAt: ["$materialesVendidos.precioFacturado", 0],
                },
              },
            },
            amount: {
              $toDouble: { $arrayElemAt: ["$materialesVendidos.cantidad", 0] },
            },
            bonusPercentage: { $toInt: "0" },
            bonusImport: { $toDecimal: "0" },
            bonusSubtotal: { $toDecimal: "0" },
            surchargePercentage: { $toInt: "0" },
            surchargeImport: { $toDecimal: "0" },
            surchargeSubtotal: { $toDecimal: "0" },
            aliquot: { $toInt: "21" },
            iva: {
              $toDecimal: {
                $multiply: [
                  {
                    $toDecimal: {
                      $arrayElemAt: ["$materialesVendidos.subtotal", 0],
                    },
                  },
                  0.21,
                ],
              },
            },
            subtotalWithIva: {
              $toDecimal: {
                $toString: {
                  $arrayElemAt: ["$materialesVendidos.subtotal", 0],
                },
              },
            },
            total: {
              $toDecimal: {
                $toString: {
                  $arrayElemAt: ["$materialesVendidos.subtotal", 0],
                },
              },
            },
          },
        ],
        paymentMethod: "Efectivo",
        emissionDate: "$createdAt",
        ptoVta: {
          $toInt: "99",
        },
        cbteTipo: null,
        concepto: null,
        docTipo: "99",
        docNro: "0",
        client: {
          _id: {
            $toObjectId: "64b963ad30c9d359b8fa8a65",
          },
          name: "Cliente Generico",
          docNro: "0",
          docTipo: "99",
          legalName: "Cliente Generico",
        },
        impTotal: {
          $toDecimal: "$precioTotal",
        },
        impTotConc: {
          $toDecimal: 0,
        },
        impNeto: {
          $toDecimal: {
            $divide: ["$precioTotal", 1.21],
          },
        },
        impOpEx: {
          $toDecimal: 0,
        },
        impIVA: {
          $toDecimal: {
            $multiply: ["$precioTotal", 0.21],
          },
        },
        impTrib: {
          $toDecimal: 0,
        },
        iva: [
          {
            Id: 5,
            BaseImp: {
              $toDecimal: {
                $divide: ["$precioTotal", 1.21],
              },
            },
            Importe: {
              $toDecimal: {
                $multiply: ["$precioTotal", 0.21],
              },
            },
          },
        ],
        store: {
          _id: {
            $toObjectId: "$acopioId",
          },
          completed: {
            $cond: {
              if: {
                $eq: ["$faltaAcopio", true],
              },
              then: false,
              else: true,
            },
          },
        },
        cbteDesde: null,
        cbteHasta: null,
        afipStatus: {
          $toBool: 0,
        },
      },
    },
    {
      $sort: {
        invoiceNumber: 1,
      },
    },
  ]);

  res.json(migraList);
};

migraCtrl.acopiosMigra = async (req, res) => {
  const stores = await Acopio.aggregate([
    {
      $unwind: {
        path: "$materialesRetirados",
      },
    },
    {
      $addFields: {
        fechaRetiro: {
          $arrayElemAt: ["$materialesRetirados.fechaRetiro", 0],
        },
      },
    },
    {
      $project: {
        materials: {
          $slice: [
            "$materialesRetirados",
            1,
            {
              $size: "$materialesRetirados",
            },
          ],
        },
        date: "$fechaRetiro",
        client: {
          $toObjectId: "$clienteId",
        },
        store: "$_id",
        _id: 0,
      },
    },
    {
      $addFields: {
        materials: {
          $map: {
            input: "$materials",
            as: "material",
            in: {
              date: "$fechaRetiro",
              name: "$$material.mercaderia",
              withdrawn: "$$material.cantidadRetirada",
              stored: {
                $sum: [
                  "$$material.cantidadRetirada",
                  "$$material.cantidadFaltante",
                ],
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        date: {
          $toDate: "$date",
        },
      },
    },
    {
      $group: {
        _id: "$store",
        materials: {
          $push: "$materials",
        },
        date: {
          $first: "$date",
        },
        client: {
          $first: "$client",
        },
        store: {
          $first: "$store",
        },
      },
    },
    {
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          materials: {
            $arrayElemAt: ["$materials", 0],
          },
        },
    },
  ]);
  const withdrawals = await Acopio.aggregate([
    {
      $unwind: {
        path: "$materialesRetirados",
      },
    },
    {
      $addFields: {
        fechaRetiro: {
          $arrayElemAt: ["$materialesRetirados.fechaRetiro", 0],
        },
      },
    },
    {
      $project: {
        materials: {
          $slice: [
            "$materialesRetirados",
            1,
            {
              $size: "$materialesRetirados",
            },
          ],
        },
        date: "$fechaRetiro",
        client: {
          $toObjectId: "$clienteId",
        },
        store: "$_id",
        _id: 0,
      },
    },
    {
      $addFields: {
        dispatchNumber: 1,
        materials: {
          $map: {
            input: "$materials",
            as: "material",
            in: {
              date: "$fechaRetiro",
              name: "$$material.mercaderia",
              amount: "$$material.cantidadRetirada",
            },
          },
        },
      },
    },
  ]);

  res.json({ stores: stores, withdrawals: withdrawals });
};

module.exports = migraCtrl;
