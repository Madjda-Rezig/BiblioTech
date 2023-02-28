const empruntModel = require("../models/empruntModel");
const livreModel = require("../models/livreModel");
const expressAsyncHandler = require("express-async-handler");

//Afficher tous les emprunts
exports.getAllEmprunts = expressAsyncHandler(async (req, res) => {
  try {
    const emprunts = await empruntModel.find();
    res.status(200).json(emprunts);
  } catch (error) {
    res.status(400);
    console.error(error);
  }
});

//Ajouter un emprunt
exports.postEmprunt = expressAsyncHandler(async (req, res) => {
  try {
    const idUser = req.user._id;
    const idLivre = req.params.idLivre;
    const livre = await livreModel.findById(idLivre);
    if (!livre) {
      return res.status(404).json({ message: "Livre introuvable" });
    }
    if (livre.nombreExemplairesEmpruntes >= livre.nombreTotalExemplaires) {
      return res.status(400).json({ message: "Le livre n'est pas disponible" });
    }
    const dateEmprunt = new Date();
    const moisCourant = dateEmprunt.getMonth();
    const nbEmpruntsMois = await empruntModel.countDocuments({
      idUser,
      date: { $gte: new Date(dateEmprunt.getFullYear(), moisCourant, 1) },
    });
    if (nbEmpruntsMois >= 3) {
      return res
        .status(400)
        .json({ message: "Vous avez atteint la limite d'emprunts pour ce mois-ci" });
    }
    await empruntModel.create({
      idUser,
      idLivre,
      date: dateEmprunt,
      temp: "emprunt",
    });
    livre.nombreExemplairesEmpruntes++;
    await livre.save();
    res.status(201).json("vous venez d'emprunter un livre");
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});

//Rendre un livre
exports.rendreLivre = expressAsyncHandler(async (req, res) => {
  try {
    const idUser = req.user._id;
    const idEmprunt = req.params.idEmprunt;
    const emprunt = await empruntModel.findById(idEmprunt);
    if (!emprunt) {
      return res.status(404).json({ message: "Emprunt introuvable" });
    }
    if (emprunt.idUser.toString() !== idUser.toString()) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à rendre cet emprunt" });
    }
    const livre = await livreModel.findById(emprunt.idLivre);
    livre.nombreExemplairesEmpruntes--;
    await livre.save();
    emprunt.temp = "retour";
    await emprunt.save();
    res.status(200).json("Vous venez de rendre un livre");
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});
