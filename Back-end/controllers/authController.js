import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export const register = async (req, res) => {
//   const { name, email, password, role, experience, skills } = req.body;

//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: "Email exists" });

//   const hashed = await bcrypt.hash(password, 10);

// const user = await User.create({
//   name,
//   email,
//   password: hashed,
//   role,
//   experience: role === "helper" ? experience || "" : "",
//   skills:
//     role === "helper"
//       ? Array.isArray(skills)
//         ? skills
//         : []
//       : [],
// });

//   res.status(201).json({ message: "Registered" });
// };


export const register = async (req, res) => {
 try {

  const { name, email, password, role, experience, skills } = req.body;

  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(400).json({
      message:"Email exists"
    });
  }

  const hashed = await bcrypt.hash(password,10);

  await User.create({
    name,
    email,
    password:hashed,
    role,
    experience: role==="helper" ? experience || "" : "",
    skills: role==="helper" ? skills || [] : []
  });

  res.status(201).json({
    message:"Registered"
  });

 } catch(error){

  console.log("REGISTER ERROR:",error);

  res.status(500).json({
    message:error.message
  });
 }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
};