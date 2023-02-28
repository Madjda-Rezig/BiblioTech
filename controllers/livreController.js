const livreModel = require("../models/livreModel")



const expressAsyncHandler = require("express-async-handler")

//Afficher touts les livres

exports.getAllLivres = expressAsyncHandler(async (req, res) => {
  try {
    const livres = await livreModel.find()
    res.status(200).json(livres)
  } catch (error) {
    res.status(400)
    console.error(error)
  }
})






//Ajouter un livre
exports.postLivre = expressAsyncHandler(async (req, res) => {
  try {
    const {  nomLivre, auteur ,note,IdCategorie,nombreTotalExemplaires,nombreExemplairesEmpruntes} =
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
        nombreTotalExemplaires

    })
    res.status(201).json("Le livre a été ajouté a la bibliothèque !")
  } catch (error) {
    res.status(400)
    console.log(error)
  }
})

