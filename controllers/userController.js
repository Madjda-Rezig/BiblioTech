const UserModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const expressAsyncHandler = require("express-async-handler")

//Create a user
exports.ajouterUtilisateur = expressAsyncHandler(async (req, res) => {
  try {
    const { mot_de_passe, ...body } = req.body
    await UserModel.create({
      ...body,
      mot_de_passe: await bcrypt.hash(req.body.mot_de_passe, 10),
    })
    res.status(201).json("l'utilisateur a été crée !")
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

//Update a user
exports.modifierUtilisateur = expressAsyncHandler(async (req, res) => {
  try {
    const id = req.user._id
    await UserModel.findByIdAndUpdate(id, req.body)
    res.status(200).json("User updated!")
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

//Delete a user
exports.supprimerUtilisateur = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    await UserModel.findByIdAndDelete(id)
    res.status(202).json("User deleted Successfully:")
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})
//Delete his account
exports.autoDelete = expressAsyncHandler(async (req, res) => {
  try {
    const id = req.user._id
    await UserModel.findByIdAndDelete(id)
    res.status(202).json("User deleted Successfully:")
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})