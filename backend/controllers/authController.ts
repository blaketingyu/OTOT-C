//guide used https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified
//https://github.com/WebDevSimplified/JWT-Authentication

import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../src/config";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel";
//import { hashPassword } from "./userController";
import bcrypt from "bcrypt";
import { RefreshToken } from "../models/refreshtokenModel";
import { access } from "fs";

export interface IGetUserAuthInfoRequest extends Request {
  user: typeof User; // or any other type
}

//Authentication
function createAccessToken({
  username,
  userPassword,
}: {
  username: string;
  userPassword: string;
}) {
  return jwt.sign({ username, userPassword }, ACCESS_TOKEN, {
    expiresIn: "10m",
  });
}

//Authentication
function createRefreshToken({
  username,
  userPassword,
}: {
  username: string;
  userPassword: string;
}) {
  return jwt.sign({ username, userPassword }, REFRESH_TOKEN, {
    expiresIn: "1h",
  });
}
/*
User credentials sent to /signin
/signin returns a JWT (signed with a key)
JWT is stored in localStorage
JWT is sent on every request (to API)
The server can read the JWT and extract user ID out of it
*/

export async function signin(req: Request, res: Response) {
  try {
    const { name, hashPassword } = req.body;

    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(409).send("User does not exist");
    }
    try {
      if (await bcrypt.compare(hashPassword, user.hashPassword)) {
        //password same
        const accessToken = createAccessToken({
          username: name,
          userPassword: hashPassword,
        });

        const refreshToken = createRefreshToken({
          username: name,
          userPassword: hashPassword,
        });

        //Save token locally
        const token = new RefreshToken();
        token.rtoken = accessToken;
        token.save((err) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ status: "error", message: "Internal server error" });
          }
        });
        res
          .status(200)
          .json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        //Wrong password
        return res
          .status(401)
          .json({ status: "error", message: "Invalid credentials" });
      }
    } catch (err) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
}

export async function AuthenticateToken(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //Undefined or actual token
    if (!token) {
      return res.status(401).json({ status: "error", message: "Unauthorized" }); //No token
    }

    try {
      jwt.verify(token, ACCESS_TOKEN, (err: Error, user: typeof User) => {
        if (err) {
          return res
            .status(403)
            .json({ status: "error", message: "Forbidden" }); //No token
        }

        req.user = user;
        next();
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
}

export async function signout(req: Request, res: Response) {
  try {
    const token = req.body.token;
    RefreshToken.remove({ token }, (err: Error) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: "Internal server error, cant save new user",
        });
      }
    });
    return res.status(200).json({
      status: "success",
      message: "successfully signout",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error, cant save new user",
    });
  }
}
