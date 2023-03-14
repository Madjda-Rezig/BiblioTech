const empruntModel = require("../models/empruntModel");
const livreModel = require("../models/livreModel");
const UserModel = require("../models/userModel")
const expressAsyncHandler = require("express-async-handler");

//Afficher tous les emprunts

exports.getAllEmprunts = async (req, res) => {
  try {
    const emprunts = await empruntModel.find({})
    res.status(200).json({ success: true, emprunts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


// Ajouter un emprunt
exports.addEmprunt = expressAsyncHandler(async (req, res) => {
  try {
    const { idUser, idLivre, dateEmprunt, dateRetour, nomLivre, auteur } = req.body;

    // Vérifier si le livre est disponible
    const livreDisponible = await livreModel.findById(idLivre);
    if (!livreDisponible.disponible) {
      res.status(400).json({ message: "Le livre n'est pas disponible pour l'emprunt" });
      return;
    }

    // Vérifier si l'utilisateur a atteint la limite d'emprunts mensuels
    const moisActuel = new Date().getMonth() + 1; // getMonth() retourne un index de 0 à 11
    const nbEmpruntsMois = await empruntModel.countDocuments({
      idUser: idUser,
      dateEmprunt: { $gte: new Date(`${moisActuel}/1/${new Date().getFullYear()}`) }
    });
    if (nbEmpruntsMois >= 3) {
      res.status(400).json({ message: "Vous avez atteint la limite d'emprunts mensuels" });
      return;
    }

    // Créer l'emprunt
    const newEmprunt = await empruntModel.create({ idUser, idLivre, dateRetour, dateEmprunt, nomLivre, auteur});

    // Mettre à jour l'état du livre
    livreDisponible.disponible = false;
    await livreDisponible.save();

    res.status(201).json(newEmprunt);
  } catch (error) {
    res.status(400).json({ message: "Impossible d'ajouter l'emprunt" });
    console.error(error);
  }
});


// Supprimer un emprunt
exports.deleteEmprunt = expressAsyncHandler(async (req, res) => {
  try {
    const empruntId = req.params.id;
    const deletedEmprunt = await empruntModel.findByIdAndDelete(empruntId);
    if (!deletedEmprunt) {
      res.status(404).json({ message: "L'emprunt spécifié n'a pas été trouvé" });
    } else {
      res.status(200).json({ message: "L'emprunt a été supprimé avec succès" });
    }
  } catch (error) {
    res.status(500).json({ message: "Impossible de supprimer l'emprunt" });
    console.error(error);
  }
});

// Modifier un emprunt
exports.updateEmprunt = expressAsyncHandler(async (req, res) => {
  try {
    const empruntId = req.params.id;
    const { idUser, idLivre, dateEmprunt, dateRetour,nomLivre,auteur } = req.body;
    const updatedEmprunt = await empruntModel.findByIdAndUpdate(empruntId, { idUser, idLivre, dateEmprunt, dateRetour,nomLivre,auteur }, { new: true });
    if (!updatedEmprunt) {
      res.status(404).json({ message: "L'emprunt spécifié n'a pas été trouvé" });
    } else {
      res.status(200).json(updatedEmprunt);
    }
  } catch (error) {
    res.status(500).json({ message: "Impossible de modifier l'emprunt" });
    console.error(error);
  }
});

// HISTORIQUE 

exports.getEmpruntsByUser = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const emprunts = await empruntModel.find({ idUser: userId });
    if (emprunts.length === 0) {
      res.status(404).json({ message: "Cet utilisateur n'a pas encore emprunté de livre" });
    } else {
      const livres = await livreModel.find({ _id: { $in: emprunts.map((emprunt) => emprunt.idLivre) } });
      const empruntsWithLivres = emprunts.map((emprunt) => {
        const livre = livres.find((livre) => livre._id.toString() === emprunt.idLivre.toString());
        return { id: emprunt._id, idUser: emprunt.idUser, dateEmprunt: emprunt.dateEmprunt, dateRetour: emprunt.dateRetour, livre };
      });
      res.status(200).json(empruntsWithLivres);
    }
  } catch (error) {
    res.status(500).json({ message: "Impossible de récupérer les emprunts" });
    console.error(error);
  }
});


//RENOUVELEMENT
exports.renewEmprunt = expressAsyncHandler(async (req, res) => {
  try {
    const { idEmprunt } = req.params;

    // Vérifier si l'emprunt existe
    const emprunt = await empruntModel.findById(idEmprunt);
    if (!emprunt) {
      res.status(404).json({ message: "Emprunt introuvable" });
      return;
    }

    // Vérifier si le livre est disponible pour le renouvellement
    const livreDisponible = await livreModel.findById(emprunt.idLivre);
    if (!livreDisponible.disponible) {
      res.status(400).json({ message: "Le livre n'est pas disponible pour le renouvellement" });
      return;
    }

    // Mettre à jour la date de retour de l'emprunt
    const today = new Date();
    const newDateRetour = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Ajouter 7 jours
    emprunt.dateRetour = newDateRetour;
    await emprunt.save();

    // Mettre à jour l'état du livre
    livreDisponible.disponible = false;
    await livreDisponible.save();

    res.status(200).json({ message: "L'emprunt a été renouvelé avec succès", emprunt });
  } catch (error) {
    res.status(500).json({ message: "Impossible de renouveler l'emprunt" });
    console.error(error);
  }
});






