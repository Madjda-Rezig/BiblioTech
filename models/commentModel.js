const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
    {
      idUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
      idLivre: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Livre",
        required: true,
      },
      commentaire: {
        type: String,
        required: true,
      },
      reponses: [
        {
          idUser: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
          },
          commentaire: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            default: new Date(),
          },
        },
      ],
      date: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Comment", CommentSchema);