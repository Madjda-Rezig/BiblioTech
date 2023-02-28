const mongoose = require("mongoose")

const empruntModel = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    idLivre: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Livre",
      required: true,
    },
    date: {
        type:Date,
        required: true,
      },
    temp: {
        type: String,
        required: true,
      },
   
   
  },
  { timestamps: true }
)

module.exports = mongoose.model("emprunt", empruntModel)