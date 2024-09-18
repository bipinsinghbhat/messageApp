const mongoose=require("mongoose")
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    role: {
      type: String,
      enum: ["Student", "Teacher", "Institute"],
      required: true,
    },
    password: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
  },
  {
    VersionKey: false,
  }
);

const UserModel=mongoose.model("UserData",UserSchema)

module.exports=UserModel