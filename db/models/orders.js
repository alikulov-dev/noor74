const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
    name: {
      type: String,
      // required: [false, 'Please, write your name at least'],
      trim: true,
      min: 4,
      max: 25
    },
    url: {
      type: String,
      required: [false, 'Please, write your name at least'],
      trim: true,
      min: 4,
      max: 25
    }
  });

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please, write your name at least'],
    trim: true,
    min: 4,
    max: 25
  },
  img: [imgSchema],
  tasker_id: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Client' 
  },
  payment_uz: {
    type: String,
    default: null,
    trim: true,
    min: 4,
    max: 25
  },
  status: {
    type: String,
    default: 'disabled',
    enum: {
      values: ['disabled', 'progress', 'finished', 'archived'],
      message: '{VALUE} is not supported'
    }
  },
  location: { longitude: String, atitude: String }
},{ timestamps: true });


orderSchema.index({ name: 1}); // schema level

module.exports = mongoose.model("Order", orderSchema);