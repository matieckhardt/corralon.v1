const { Schema, model } = require('mongoose');

const counterSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

// Add a static "increment" method to the Model
// It will recieve the collection name for which to increment and return the counter value
counterSchema.static('increment', async function (counterName) {
  const count = await this.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    // new: return the new value
    // upsert: create document if it doesn't exist
    { new: true, upsert: true }
  );
  return count.seq;
});

module.exports = model('counter', counterSchema);
