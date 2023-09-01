const mateCtrl = {};
const Material = require("../models/Materiales");

mateCtrl.index = (req, res) => {
  res.render("materiales", { active: { materiales: true } });
};

mateCtrl.listMaterial = async (req, res) => {
  const mateList = await Material.find();

  res.json(mateList.sort((a, b) => a.nombre.localeCompare(b.nombre)));
};
mateCtrl.listMigra = async (req, res) => {
  const mateList = await Material.aggregate([
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
          industry: {
            $arrayElemAt: ["$industry", 0],
          },
        },
    },
  ]);

  res.json(mateList);
};

mateCtrl.getMaterial = async (req, res) => {
  const { id } = req.params;
  const mate = await Material.findById(id).catch(function (err) {
    console.error("Error en la consulta de ID");
  });
  res.json(mate);
};

mateCtrl.createMaterial = async (req, res) => {
  try {
    const { nombre, precio, rubro, stock } = req.body;
    const mate = new Material({
      nombre,
      precio,
      rubro,
      stock,
    });
    await mate.save();
    return false;
  } catch (error) {
    res.status(500).send("There was a problem registering the mate");
  }
};

mateCtrl.editMaterial = async (req, res) => {
  try {
    const materialEdited = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!materialEdited) {
      return res.status(204).json({ message: "mate not found" });
    } else {
      return res.json(materialEdited);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("There was a problem editing the mate");
  }
};

mateCtrl.deleteMaterial = async (req, res) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const materialDeleted = await Material.findByIdAndDelete(id);
    if (!materialDeleted) {
      return res.status(204).json({ message: "mate not found" });
    } else {
      return res.json(materialDeleted);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("There was a problem deleting the mate");
  }
};

module.exports = mateCtrl;
