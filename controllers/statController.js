const empruntModel = require("../models/empruntModel");
const livreModel = require("../models/livreModel");
const userModel = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");

exports.getStats = expressAsyncHandler(async (req, res) => {
  try {
    const nbEmprunts = await empruntModel.countDocuments();
    const livresEmpruntes = await empruntModel.aggregate([
      { $group: { _id: "$idLivre", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "livres",
          localField: "_id",
          foreignField: "_id",
          as: "livre",
        },
      },
      { $unwind: "$livre" },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          id: "$livre._id",
          titre: "$livre.titre",
          auteur: "$livre.auteur",
          count: 1,
        },
      },
      { $limit: 10 },
    ]);
    const nbLecteurs = await userModel.countDocuments({ role: "lecteur" });

    res.status(200).json({ nbEmprunts, livresEmpruntes, nbLecteurs });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});