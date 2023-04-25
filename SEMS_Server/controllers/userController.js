import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {captialtheFirstLetter} from "../config/firstLetterCapital.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();
//-------------------------------------------------------------(USER)------------------------------------------------------------------------
export const getAllUser = async (req, res) => {
  try {
    const view = await User.find().select("-password");
    res.status(200).json({ data: view });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    let found=await User.findById({_id:req.params.id})
    if(!found) return res.status(400).json({message:"user not found"})  
    await User.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const ownerReg = async (req, res) => {
  const saltRounds = 10;
  if (!req.body.password)
    return res.status(400).json({ message: "please enter password" });
  let email = req.body.email;
  let firstName = captialtheFirstLetter(req.body.firstName);
  let lastName = captialtheFirstLetter(req.body.lastName);
  let exUserPhone = await User.findOne({ mobileNo: req.body.mobileNo });
  let exUserEmail = await User.findOne({ email: email });
  if (exUserEmail) return res.json({ message: "email already register" });
  if (exUserPhone) return res.json({ message: "Phone No already exists" });

  try {
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      let register = new User({
        email: email?.toLowerCase(),
        password: hash,
        firstName: firstName,
        lastName: lastName,
        mobileNo: req.body.mobileNo,
        isOwner: true,
      });
      await register.save();
      res.status(201).json({ message: "Owner register success" });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const myProfile = async (req, res) => {
//   let obj = {};
//   try {
//     let address = await Address.findOne({ userId: req.user.id });
//     obj = { ...obj, address };
//     let education = await Education.findOne({ userId: req.user.id });
//     obj = { ...obj, education };
//     let document = await Document.findOne({ userId: req.user.id });
//     obj = { ...obj, document };
//     let experience = await Experience.find({ userId: req.user.id });
//     obj = { ...obj, experience };
//     let family = await Family.find({ userId: req.user.id });
//     obj = { ...obj, family };
//     let work = await Work.findOne({ userId: req.user.id });
//     obj = { ...obj, work };
//     res.status(200).json({ data: obj });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const  reg = async (req, res) => {
  const saltRounds = 10;
  let email = req.body.email;
  let firstName = captialtheFirstLetter(req.body.firstName);
  let lastName = captialtheFirstLetter(req.body.lastName);
  let exUserPhone = await User.findOne({ mobileNo: req.body.mobileNo });
  let exUserEmail = await User.findOne({ email: email });
  if (exUserEmail)
    return res.status(400).json({ message: "email already register" });
  if (exUserPhone)
    return res.status(400).json({ message: "Phone No already exists" });
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    try {
      let register = new User({
        firstName: firstName,
        lastName: lastName,
        email: email?.toLowerCase(),
        mobileNo: req.body.mobileNo,
        password: hash,
        roleId: req.body.roleId,
      });
      let user = await register.save();
      res.status(201).json({ message: "Register success", userId: user._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

export const login = async (req, res) => {
  let email = req.body.email?.toLowerCase();
  let foundUser = await User.findOne({ email: email });
  if (!req.body.email)
    return res.status(400).json({ message: "please enter email" });
  if (!req.body.password)
    return res.status(400).json({ message: "please enter password" });
  if (foundUser) {
    if (foundUser.isOwner == false && foundUser.isActive == false)
      return res.status(400).json({ message: "your are not active user" });
    if (foundUser.isOwner == false && foundUser.isBlock == true)
      return res.status(400).json({ message: "your are blocked user" });
    bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
      if (result) {
        try {
          const token = jwt.sign({ id: foundUser?._id }, process.env.JWT, {
            expiresIn: "12h",
          });
          res.header("sems-auth-token", token).json({ message: "login successfully", token: token });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.status(400).json({ message: "please enter correct password" });
      }
    });
  } else {
    res.status(404).json({ message: "user not found" });
  }
};

export const profile = async (req, res) => {
  try {
    const view = await User.findById({ _id: req.user.id }).select("-password").populate("roleId");
    if (!view) return res.status(404).json({ message: "user not found" });
    res.status(200).json({ data: view });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const view = await User.findById({ _id: req.params.id }).select("-password").populate("roleId");
    res.status(200).json({ data: view });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
   try {
    const userExist = await User.findById({ _id: req.params.id });
    if (!userExist) return res.status(404).json({ message: "user not found" });
    await User.findByIdAndUpdate({ _id: req.params.id },{ $set: req.body },{ new: true });
    res.status(200).json({ message: "update successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
