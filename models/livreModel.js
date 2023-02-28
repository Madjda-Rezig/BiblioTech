const mongoose = require("mongoose")

const livreModel = new mongoose.Schema({
 nomLivre: {
    type: String,
    required: true,
  },  
  auteur: {
    type: String,
    required: true,
  },
  IdCategorie: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Categorie",
    required: true,
  },
  
}, {timestamps: true})

module.exports = mongoose.model("livre", livreModel)