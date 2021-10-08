const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");

//Schema
//A mongoose schema defines the structure of the document, default value,validators etc
const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//generating tokens or creating token
RegisterSchema.methods.generateAuthToken = async function (req, res) {
  try {
    console.log(this._id);

    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token }); //passing generated token to token field
    await this.save();

    console.log(token);
    return token;
  } catch (error) {
    res.send("the error part" + error);
    console.log("the error part" + error);
  }
};

//password hashing by using mongoose hook

RegisterSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`The current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`After hashing password is ${this.password}`);
  }
  next();
});

//Model
//create collection
const Register = new mongoose.model("Register", RegisterSchema);

module.exports = Register;
