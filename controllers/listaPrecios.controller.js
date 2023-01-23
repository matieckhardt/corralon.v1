const lpreCtrl = {};
const Material = require("../models/Materiales");

lpreCtrl.index = async (req, res) => {
  const mateList = await Material.find().lean();
  const mateSort = mateList.sort((a, b) => a.nombre.localeCompare(b.nombre));
  const Aridos = mateSort.filter(function (element) {
    return element.rubro === "Aridos";
  });

  const Ladrillos = mateSort.filter(function (element) {
    return element.rubro === "Ladrillos";
  });
  const Bolsas = mateSort.filter(function (element) {
    return element.rubro === "Bolsas";
  });
  const Caños = mateList.filter(function (element) {
    return element.rubro === "Caños";
  });
  const Vigas = mateSort.filter(function (element) {
    return element.rubro === "Vigas";
  });
  const Hidrofugos = mateSort.filter(function (element) {
    return element.rubro === "Hidrofugos";
  });
  const Hierros = mateSort.filter(function (element) {
    return element.rubro === "Hierros";
  });
  const Otros = mateSort.filter(function (element) {
    return element.rubro === "otros";
  });
  const rubros = {
    Aridos,
    Ladrillos,
    Bolsas,
    Caños,
    Vigas,
    Hidrofugos,
    Hierros,
    Otros,
  };
  res.render("listaPrecios", {
    Precios: rubros,
    active: { listaPrecios: true },
  });
};

module.exports = lpreCtrl;
