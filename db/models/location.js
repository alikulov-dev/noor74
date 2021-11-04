const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  address_line1: {
    type: String,
    default: null,
    required: [true, 'Email address is required'],
    trim: true,
    min: 4,
    max: 50
  },
  address_line2: {
    type: String,
    default: null,
    trim: true,
    min: 4,
    max: 50
  },
  city: {
    type: String,
    lowercase: false,
    required: [true, 'City address is required'],
    trim: true,
    min: 4,
    max: 50
    // unique: true,
    // required: 'Email address is required',
    // validate: [validateEmail, 'Please fill a valid email address'],
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  postal_code: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    // Validation succeeds! Phone number is defined
    // and fits `DDD-DDD-DDDD`
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    // required: [true, 'Admin phone number required'],
    min: 7,
    max: 20
  },
  country: {
    type: String,
    lowercase: false,
    required: [false, 'City address is required'],
    trim: true,
    min: 4,
    max: 50
  },
  telephone: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    // Validation succeeds! Phone number is defined
    // and fits `DDD-DDD-DDDD`
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    // required: [true, 'Admin phone number required'],
    min: 7,
    max: 20
  },
},{ timestamps: true });


locationSchema.index({ user_id: 1}); // schema level

module.exports = mongoose.model("Location", locationSchema);