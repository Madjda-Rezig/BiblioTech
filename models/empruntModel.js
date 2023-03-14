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
    nomLivre: {
      type: String,
      
    },
    auteur: {
      type: String,
      
    },
    dateEmprunt: {
      type: Date,
      
      default: Date.now,
    },
    dateRetour: {
      type: Date,
    },
    renouvele: {
      type: Boolean,
      default: false,
    },
   
  },
  { timestamps: true }
)

module.exports = mongoose.model("emprunt", empruntModel)