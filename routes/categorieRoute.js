const {
    getAllCategories,
    postCategorie,
    deleteCategorie
  } = require("../controllers/categorieController")
  const categorieRouter = require("express").Router()
  
  categorieRouter
    .get("/all", getAllCategories)
    .post("/add", postCategorie)
    .delete("/:id", deleteCategorie)
   
  module.exports = categorieRouter
  