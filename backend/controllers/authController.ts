//guide used https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified
//https://github.com/WebDevSimplified/JWT-Authentication

import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../src/config";
import { NextFunction, Request, Response } from "express";
import { User, UserDocument } from "../models/userModel";
//import { hashPassword } from "./userController";
import bcrypt from "bcrypt";
import { RefreshToken } from "../models/refreshtokenModel";

export interface IGetUserAuthInfoRequest extends Request {
  user: UserDocument; // or any other type
}

export interface JwtPayload {
  username: string;
  userPassword: string;
}

//Authentication
function createAccessToken({
  username,
  userPassword,
}: {
  username: string;
  userPassword: string;
}) {
  return jwt.sign({ username, userPassword }, REFRESH_TOKEN, {
    expiresIn: "30m",
  });

  //return jwt.sign({ username, userPassword }, ACCESS_TOKEN);
}

//Authentication
function createRefreshToken({
  username,
  userPassword,
}: {
  username: string;
  userPassword: string;
}) {
  //return jwt.sign({ username, userPassword }, REFRESH_TOKEN);

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
            return res.status(500).json({
              code: "500",
              status: "error",
              message: "Internal server error",
            });
          }
        });
        res
          .status(200)
          .json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        //Wrong password
        return res.status(401).json({
          code: "401",
          status: "error",
          message: "Invalid credentials",
        });
      }
    } catch (err) {
      return res
        .status(401)
        .json({ code: "401", status: "error", message: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ code: "500", status: "error", message: "Internal server error" });
  }
}

export async function AuthenticateTokenUser(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //Undefined or actual token
  if (!token) {
    return res
      .status(401)
      .json({ code: "401", status: "error", message: "Unauthorized" }); //No token
  }

  try {
    const reqToken = jwt.verify(token, ACCESS_TOKEN) as JwtPayload;

    console.log(reqToken.username);
    const findUser = await User.findOne({ name: reqToken.username });
    console.log(`user: ${findUser.name}, ${findUser.hashPassword}`);

    let tempArr = ["admin", "user"];
    if (!findUser.userRole || !tempArr.includes(findUser.userRole)) {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    req.user = findUser;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
}

export async function AuthenticateTokenAdmin(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //Undefined or actual token
  if (!token) {
    return res.status(401).json({ status: "error", message: "Unauthorized" }); //No token
  }

  try {
    const reqToken = jwt.verify(token, ACCESS_TOKEN) as JwtPayload;

    console.log(reqToken.username);
    const findUser = await User.findOne({ name: reqToken.username });
    console.log(`user: ${findUser.name}, ${findUser.hashPassword}`);

    if (!findUser.userRole || findUser.userRole != "admin") {
      return res
        .status(403)
        .json({ code: "403", status: "error", message: "Forbidden" });
    }
    req.user = findUser;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ code: "500", status: "error", message: "Internal server error" });
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
          code: "500",
          message: "Internal server error, cant save new user",
        });
      }
    });
    return res.status(200).json({
      code: "200",
      status: "success",
      message: "successfully signout",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "500",
      status: "error",
      message: "Internal server error, cant save new user",
    });
  }
}
