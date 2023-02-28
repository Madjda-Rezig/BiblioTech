const mongoose = require("mongoose");

const livreModel = new mongoose.Schema(
  {
    nomLivre: {
      type: String,
      required: true,
    },
    auteur: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    IdCategorie: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Categorie",
      required: true,
    },
    nombreTotalExemplaires: {
      type: Number,
      required: true,
      default: 0,
    },
    nombreExemplairesEmpruntes: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("livres", livreModel);
