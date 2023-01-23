const { Schema, model } = require("mongoose");

const chunksSchema = new Schema(
    {
        _id: Object,
        files_id: Object,
        n: Number,
        data: Buffer,
  },
{
    timestamps: true,
  }
);

module.exports = model("photos.chunks", chunksSchema);