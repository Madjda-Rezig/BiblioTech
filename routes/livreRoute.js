const { getAllLivres, postLivre} = require("../controllers/livreController")


const livreRouter = require("express").Router()

livreRouter.get("/all", getAllLivres).post("/add", postLivre)


module.exports = livreRouter