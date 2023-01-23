const { Schema, model } = require("mongoose");
const Counter = require("./Counter");

const comprobanteSchema = new Schema(
  {
    comprobanteId: Number,
    fechaComp: String,
    fechaValidez: String,
    tipoFc: String,
    clienteNombre: String,
    clienteCuit: String,
    clienteTel: String,
    clienteDomicilio: String,
    clienteObse: String,
    clienteCF: String,
    productos: Array,
    subTotal: String,
    descuentos: String,
    total: String,
    bultos: String,
  },
  {
    timestamps: true,
  }
);

comprobanteSchema.pre("save", async function () {
  if (!this.isNew) return;
  const comprobanteId = await Counter.increment("entity");
  this.comprobanteId = comprobanteId;
});

module.exports = model("comprobante", comprobanteSchema);
