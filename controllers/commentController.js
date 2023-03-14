const CommentModel = require("../models/commentModel");
const expressAsyncHandler = require("express-async-handler");

// Afficher tous les commentaires sur un livre
exports.getCommentsByLivre = expressAsyncHandler(async (req, res) => {
  try {
    const idLivre = req.params.id;
    const comments = await CommentModel.find({ idLivre }).populate("idUser");
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: "une erreur est survenu lors de votre recherche" });
    console.error(error);
  }
});

// Ajouter un commentaire sur un livre
exports.addComment = expressAsyncHandler(async (req, res) => {
  try {
    const { idUser, idLivre, commentaire } = req.body;
    const newComment = await CommentModel.create({ idUser, idLivre, commentaire });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: "Impossible d'ajouter le commentaire" });
    console.error(error);
  }
});

// Modifier un commentaire
exports.updateComment = expressAsyncHandler(async (req, res) => {
  try {
    const commentId = req.params.id;
    const { commentaire } = req.body;
    const updatedComment = await CommentModel.findByIdAndUpdate(commentId, { commentaire }, { new: true });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: "Impossible de modifier le commentaire" });
    console.error(error);
  }
});

// Supprimer un commentaire
exports.deleteComment = expressAsyncHandler(async (req, res) => {
  try {
    const commentId = req.params.id;
    await CommentModel.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Commentaire supprimé avec succès" });
  } catch (error) {
    res.status(400).json({ message: "Impossible de supprimer le commentaire" });
    console.error(error);
  }
});

// Répondre à un commentaire
exports.replyToComment = expressAsyncHandler(async (req, res) => {
  try {
    const {commentId} = req.params
    const { body,idUser } = req.body;
    const responseObject = {
      idUser,
      commentaire: body
    }
    await CommentModel.findByIdAndUpdate(commentId, { $push: {reponses: responseObject} });
    res.status(201).json("Reply added successfully!");
  } catch (error) {
    res.status(400).json({ message: "Impossible de répondre aux commentaire" });
    console.error(error);
  }
});