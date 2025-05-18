import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "https://res.cloudinary.com/dwckwrdvx/image/upload/v1747554396/Default_xltl9b.webp",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;