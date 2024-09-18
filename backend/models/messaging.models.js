const mongoose=require("mongoose")


const replySchema = new mongoose.Schema(
  {
    
    text: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    replies: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true }
);



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
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const MessageModel=mongoose.model("MessageData",MessageSchema)

module.exports=MessageModel