const mongoose = require("mongoose");
const validator = require("validator");

var User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: value => {
        return validator.isEmail(value);
      },
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    minlenght: 1,
    trim: true
  }
});

module.exports = {
  User
};
