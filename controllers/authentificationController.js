const UserModel = require("../models/userModel")
const RefreshTokenModel = require("../models/refreshTokenModel")
const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//Sign token
const generateToken = (data) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: "30m" })
  return token
}
//Login user [ACCESS TOKEN,REFRESH TOKEN]
exports.Login = expressAsyncHandler(async (req, res) => {
  try {
    const { mail, mot_de_passe } = req.body
    if (!mail || !mot_de_passe) {
      res.status(400)
      throw new Error("Empty fields!")
    }
    const userExist = await UserModel.find({ mail: mail })
    if (userExist.length == 0) {
      res.status(400)
      throw new Error("User doesn't exist!")
    }
    const matchPassword = await bcrypt.compare(
      mot_de_passe,
      userExist[0].mot_de_passe
    )
    if (!matchPassword) {
      res.status(400)
      throw new Error("Wrong password!")
    }
    const accessToken = generateToken({
      _id: userExist[0]._id,
      role: userExist[0].role,
    })
    const refreshToken = jwt.sign(
      { _id: userExist[0]._id, role: userExist[0].role },
      process.env.REFRESH_TOKEN
    )
    await RefreshTokenModel.create({ userId: userExist[0]._id, refreshToken })
    res.status(200).json({
      _id: userExist[0]._id,
      mail: userExist[0].mail,
      role: userExist[0].role,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

//Refresh access token
exports.refreshAccess = expressAsyncHandler(async (req, res) => {
  try {
    const { token } = req.body
    if (!token) {
      res.status(400)
      throw new Error("No refreshToken!")
    }
    const refreshExists = await RefreshTokenModel.find({ refreshToken: token })
    if (refreshExists.length == 0) {
      res.status(400)
      throw new Error("No refreshToken!")
    }
    const userData = jwt.verify(token, process.env.REFRESH_TOKEN)
    const { iat, ...data } = userData
    const accessToken = generateToken(data)
    res.status(200).json({ token: accessToken })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

//Logout
exports.logout = expressAsyncHandler(async (req, res) => {
  try {
    const { token } = req.body
    if (!token) {
      res.status(400)
      throw new Error("No token!")
    }
    await RefreshTokenModel.findOneAndDelete({ refreshToken: token })
    res.status(200).json("You are logged out!")
  } catch (error) {
    throw new Error(error)
  }
})
