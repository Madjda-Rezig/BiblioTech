const {
    getAllCategories,
    postCategorie,
    deleteCategorie
  } = require("../controllers/categorieController")
  const categorieRoute = require("express").Router()
  
  categorieRoute
    .get("/all", getAllCategories)
    .post("/add", postCategorie)
    .delete("/:id", deleteCategorie)
   
  module.exports = categorieRoute
  