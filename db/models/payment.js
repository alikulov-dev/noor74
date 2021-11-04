const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  payment_type: {
    type: String,
    required: [true, 'payment_type  is required']
  },
  provider: {
    type: String,
    default: null,
    required: [true, 'provider  is required'],
    trim: true,
    min: 4,
    max: 50
  },
  card_number: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: true,
    // Validation succeeds! Phone number is defined
    // and fits `DDD-DDD-DDDD`
    validate: {
      validator: function (v) {
        return /\d{4}-\d{4}-\d{4}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid card_number!`
    },
    // required: [true, 'Admin phone number required'],
    min: 15,
    max: 17
  },
  expiry: { 
    type: Date,
    required: [true, 'Please, write assign expiry at least']
  },
  status: {
    type: String,
    default: 'disabled',
    enum: {
      values: ['disabled', 'progress', 'finished', 'archived'],
      message: '{VALUE} is not supported'
    }
  },
},{ timestamps: true });


paymentSchema.index({ user_id: 1}); // schema level

module.exports = mongoose.model("Payment", paymentSchema);