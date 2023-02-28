const mongoose = require("mongoose") 

const categorieModel = new mongoose.Schema({
    nomcategorie: {
        type: String, 
        required: true,
    }
})

module.exports = mongoose.model("categories", categorieModel) 