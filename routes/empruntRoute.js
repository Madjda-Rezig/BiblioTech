const { getAllEmprunts,addEmprunt,deleteEmprunt,updateEmprunt,getEmpruntsByUser} = require("../controllers/empruntController");

const empruntRouter = require("express").Router();

empruntRouter.get("/all", getAllEmprunts);
empruntRouter.post("/add", addEmprunt);

// Delete an existing emprunt by ID
empruntRouter.delete("/:id", deleteEmprunt);

// Update an existing emprunt by ID
empruntRouter.put("/:id", updateEmprunt);


empruntRouter.get('/users/:id/emprunts', getEmpruntsByUser);

module.exports = empruntRouter;