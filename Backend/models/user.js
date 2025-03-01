const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      //required: true,
      unique: true,
    },
    password: {
      type: String,
      //required: true, // Will be used when authentication is added
    },
    role: {
      type: String,
      enum: ["admin", "presentor", "panel", "attendee"],
      required: true,
    },
  }, { timestamps: true });
  
  const User = mongoose.model("User", userSchema);
  module.exports=User;
