const { Schema, model } = require("mongoose");

const rubroSchema = new Schema(
  {
    nombre: String,
    tipo: String,
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("rubro", rubroSchema);
