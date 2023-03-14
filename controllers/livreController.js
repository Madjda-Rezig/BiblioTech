const livreModel = require("../models/livreModel")
const nodemailer = require("nodemailer")
const UserModel = require("../models/userModel")
const expressAsyncHandler = require("express-async-handler");

//Afficher touts les livres

exports.getAllLivres = expressAsyncHandler(async (req, res) => {
  try {
    const { categorie, auteur, note, nombreExemplairesEmpruntes } = req.query;

    // ajout d'un filtre
    const filter = {};
    if (categorie) {
      filter.IdCategorie = categorie;
    }
    if (auteur) {
      filter.auteur = auteur;
    }
    if (note) {
      filter.note = note;
    }
    if (nombreExemplairesEmpruntes) {
      filter.nombreExemplairesEmpruntes = nombreExemplairesEmpruntes;
    }

    const livres = await livreModel.find(filter);
    res.status(200).json(livres);
  } catch (error) {
    res.status(400).json({ message: "une erreur est survenu lors de votre recherche" });
    console.error(error);
  }
});







//Ajouter un livre
exports.postLivre = expressAsyncHandler(async (req, res) => {
  try {
    const {  nomLivre, auteur ,note,IdCategorie,nombreTotalExemplaires,nombreExemplairesEmpruntes,disponible} =
      req.body
    if (
      !nomLivre ||
      !note ||
      !nombreTotalExemplaires ||
      !nombreExemplairesEmpruntes ||
      !auteur 
    ) {
      res.status(400).json("Impossible d'ajouter le livre a la bibliothèque !!")
    }

    await livreModel.create({
        nomLivre, 
        auteur ,
        note,
        IdCategorie,
        nombreExemplairesEmpruntes,
        nombreTotalExemplaires,
        disponible

    })
    
    res.status(201).json("Le livre a été ajouté a la bibliothèque !")
  } catch (error) {
    res.status(400)
    console.log(error)
  }
})

// Supprimer un livre :
exports.deleteLivre = expressAsyncHandler(async (req, res) => {
  try {
    const id = req.params.id
    await livreModel.findByIdAndDelete(id)
    res.status(201).json("Vous avez supprimé ce Livre ")
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

