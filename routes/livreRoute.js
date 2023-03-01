const { getAllLivres, postLivre,deleteLivre} = require("../controllers/livreController")


const livreRouter = require("express").Router()

livreRouter.get("/all", getAllLivres).post("/add", postLivre).delete("/:id",deleteLivre)

module.exports = livreRouter