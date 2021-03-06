const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = " Email Field Is Required ";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = " Email Is Invalid";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = " Password Field Is Required ";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 15 })) {
    errors.password = " Password Must Be At Least 6 Characters";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = " Confirm Your Password ";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 =
      "Passwords Do Not Match, Please Make Sure Your Passwords Match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
