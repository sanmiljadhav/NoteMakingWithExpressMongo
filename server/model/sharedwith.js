const mongoose = require("mongoose");

//Schema
//A mongoose schema defines the structure of the document, default value,validators etc
const SharedWithSchema = new mongoose.Schema({
  shareduserid: {
    type: String,
    required: true,
  },
  noteid: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Sharedwith = new mongoose.model("Sharedwith", SharedWithSchema);

module.exports = Sharedwith;
