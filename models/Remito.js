const { Schema, model } = require("mongoose");
const Counter = require("./Counter");

const RemitoSchema = new Schema(
  {
    remitoId: Number,
    fechaComp: String,
    fechaValidez: String,
    tipoFc: String,
    clienteNombre: String,
    clienteCuit: String,
    clienteTel: String,
    clienteDomicilio: String,
    clienteCF: String,
    productos: Array,
    bultos: String,
  },
  {
    timestamps: true,
  }
);

RemitoSchema.pre("save", async function () {
  if (!this.isNew) return;
  const remitoId = await Counter.increment("entity");
  this.remitoId = remitoId;
});

const RemitoListSchema = new Schema({
  cliente: String,
  clienteId: String,
  ventaId: String,
  acopioId: String,
  listaRemitos: Array,
});

module.exports = model("Remito", RemitoListSchema);
