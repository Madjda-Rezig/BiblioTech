const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Livre = require("../models/livreModel");

const sendMail = async (req, res, next) => {
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // Connect with SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Check if a new book has been added
  const newLivres = await Livre.find({ createdAt: { $gte: req.lastCheck } });
  if (newLivres.length > 0) {
    const lecteurs = await User.find({ role: "lecteur" });

    // Send email to all lecteurs
    const promises = lecteurs.map(async (lecteur) => {
      const info = await transporter.sendMail({
        from: '"Maggie 👻" <rezigmadjda@yahoo.com>',
        to: lecteur.mail,
        subject: "Nouveau livre ajouté",
        text: `Bonjour ${lecteur.prenom},\n\nUn nouveau livre a été ajouté à la bibliothèque.`,
      });
      console.log("Message sent: %s", info.messageId);
      return info;
    });
    await Promise.all(promises);
  }

  // Check if a new lecteur has been added
  const newLecteurs = await User.find({ createdAt: { $gte: req.lastCheck }, role: "lecteur" });
  if (newLecteurs.length > 0) {
    const admins = await User.find({ role: "employe" });

    // Send email to all admins
    const promises = admins.map(async (admin) => {
      const info = await transporter.sendMail({
        from: '"Maggie 👻" <rezigmadjda@yahoo.com>',
        to: admin.mail,
        subject: "Nouveau lecteur inscrit",
        text: `Bonjour ${admin.prenom},\n\nUn nouveau lecteur s'est inscrit à la bibliothèque.`,
      });
      console.log("Message sent: %s", info.messageId);
      return info;
    });
    await Promise.all(promises);
  }

  next();
};

module.exports = sendMail;