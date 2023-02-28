const express = require("express")
const mongoose = require("mongoose")

const ErrorHandler = require("./middlewares/ErrorHandler")
const livreRouter = require("./routes/livreRoute")
const userRouter = require("./routes/userRoute")
const categorieRouter = require("./routes/categorieRoute")
const authRouter = require("./routes/authentificationRoute")
const empruntRouter = require("./routes/empruntRoute")

require("dotenv").config()

const index = express()
index.use(express.json())
index.use(express.urlencoded({ extended: true }))

index.use("/livres", livreRouter)
index.use("/users", userRouter)
index.use("/categories", categorieRouter)
index.use("/emprunt", empruntRouter)
index.use("/authentification", authRouter)

index.use("/*", (req, res) => {
  res.status(404).json("Not found!")
})
index.use(ErrorHandler)

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    index.listen(process.env.PORT, () => {
      console.log("Server running")
    })
  })
  .catch((err) => console.log(err))
