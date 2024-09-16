const mongoose=require("mongoose")

const MessageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },

    replies: [
      {
        text: { type: String, required: true },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserData",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
  }
);

const MessageModel=mongoose.model("MessageData",MessageSchema)

module.exports=MessageModel