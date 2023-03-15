const livreModel = require("../models/livreModel")
const UserModel = require("../models/userModel")
const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

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
    const utilisateurs = await UserModel.find()

    utilisateurs.forEach( users => {
      // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
  
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'cory95@ethereal.email',
          pass: 'XPhdMc6YWteZ9bMuSc'
      }
  });
  
    // send mail with defined transport object
    let info =  transporter.sendMail({
      from: 'rezigmadjda@gmail.com', // sender address
      to: users.Mail, // list of receivers
      subject: "Hello ", // Subject line
      text: `Nouveau livre ajouté  ${livreModel.nomLivre}`, // plain text body
    },
    function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("Email sent: " + info.response)
      }
    })
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

