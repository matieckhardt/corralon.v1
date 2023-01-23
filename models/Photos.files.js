const { Schema, model } = require("mongoose");

const photosSchema = new Schema(
    {
        _id: Object,
        length: Number,
        chunkSize: Number,
        uploadDate: Date,
        filename: String,
        md5: String,
        contentType: String,
  },
{
    timestamps: true,
  }
);

module.exports = model("photos.files", photosSchema);