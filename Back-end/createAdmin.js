import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

mongoose.connect("mongodb://127.0.0.1:27017/ElderCare")
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin@123", 10);

  const admin = new User({
    name: "Admin",
    email: "admin@elderassist.com",
    password: hashedPassword,
    role: "admin",
    isBlocked: false,
  });

  await admin.save();
  console.log("Admin created!");
  process.exit();
};

createAdmin();