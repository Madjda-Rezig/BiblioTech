const { getAllEmprunts, postEmprunt, rendreLivre } = require("../controllers/empruntController");

const empruntRouter = require("express").Router();

empruntRouter.get("/all", getAllEmprunts);
empruntRouter.post("/add/:idLivre", postEmprunt);
empruntRouter.put("/rendre/:idEmprunt", rendreLivre);

module.exports = empruntRouter;