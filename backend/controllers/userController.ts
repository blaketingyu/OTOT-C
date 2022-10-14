import { User } from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

//Register user
export async function registerUser(req: Request, res: Response) {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (user) {
      return res.status(409).send("Invalid Credentials");
    }
    //Bcrypting the password
    const userPassword = req.body.hashPassword;
    const hashed = await hashPassword(userPassword);
    const newUser = new User();
    newUser.name = req.body.name;
    newUser.hashPassword = hashed;
    newUser.userRole = "user";
    newUser.save((err) => {
      if (err)
        return res.status(500).json({
          status: "error",
          message: "Internal server error, cant save new user",
        });
      res.status(201).json({
        status: "success",
        message: "New user created!",
        data: newUser,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
}

//Register user
export async function registerAdmin(req: Request, res: Response) {
  try {
    const user = await User.find({ name: req.body.name });
    if (user) {
      return res.status(409).send("A user with the same name already exists");
    }

    //Bcrypting the password
    const userPassword = req.body.hashPassword;
    const hashed = await hashPassword(userPassword);
    const newUser = new User();
    newUser.name = req.body.name;
    newUser.hashPassword = hashed;
    newUser.userRole = "admin";
    newUser.save((err) => {
      if (err)
        return res.status(500).json({
          status: "error",
          message: "Internal server error, cant save new user",
        });
      res.status(201).json({
        status: "success",
        message: "New Admin created!",
        data: newUser,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
}
