const UserModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const expressAsyncHandler = require("express-async-handler")
const nodemailer = require("nodemailer");

//Create a user
exports.ajouterUtilisateur = expressAsyncHandler(async (req, res) => {
  try {
    const { mot_de_passe, ...body } = req.body
    const user = await UserModel.create({
      ...body,
      mot_de_passe: await bcrypt.hash(req.body.mot_de_passe, 10),
    })

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
    to: user.mail, // list of receivers
    subject: "Hello  ", // Subject line
    text: `bienvenue  ${user.nom}`, // plain text body
  },
  function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log("Email sent: " + info.response)
    }
  })
    res.status(201).json("l'utilisateur a été crée !")
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

//////////////////////////////////////////////


///////////////////////////////////////////////

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