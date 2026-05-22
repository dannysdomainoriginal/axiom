import { RequestHandler, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import httpError from "http-errors";
import { extname } from "path";
import { processImage } from "@/libraries/utils";
import { uploadFile } from "@/libraries/cloudflare";
import Token from "@/models/Token";

const generateToken = (id: string, res: Response) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    path: "/",
    maxAge: 7 * 24 * 3600 * 1000,
    httpOnly: true, // XSS
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

/* -------------------------------------------------------------------------- */
/*                                  REGISTER                                  */
/* -------------------------------------------------------------------------- */
export const register: RequestHandler = async (req, res) => {
  const { email, invitationCode: code } = req.body;

  const emailExists = await User.exists({ email });
  if (emailExists) {
    throw httpError[400]("This email is already registered");
  }

  const userDetails = {
    ...req.body,
    roles: ["member"],
  };

  if (code) {
    const invite = await Token.findOne({ code }).lean();

    if (!invite) {
      throw httpError[400]("Your invite token is invalid or expired");
    }
    
    if (invite.inviteAs === "admin") {
      userDetails.roles.push("admin")
    }

    userDetails.teamId = invite.teamId
  }

  const user = await User.create(userDetails);

  const image = req.files?.["profile-img"];
  const result = !!image ? await processImage(image.path) : null;
  
  if (result) {
    const ext = result.success ? ".webp" : extname(image.name);

    const { url } = await uploadFile({
      buffer: result.buffer,
      key: `profile-images/${user._id}-profile${ext}`,
      type: result.success ? "image/webp" : image.type,
    });

    if (url) user.profileImageUrl = url;
    await user.save();
  }

  generateToken(user._id.toString(), res);

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      profileImageUrl: user.profileImageUrl,
    },
    message: "New account created successfully",
  });
};

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw httpError[400]("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw httpError[400]("Invalid credentials");
  }

  generateToken(user._id.toString(), res);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      profileImageUrl: user.profileImageUrl,
    },
    message: `User: ${user.name} has successfully logged in`,
  });
};

/* -------------------------------------------------------------------------- */
/*                                 LOGOUT USER                                */
/* -------------------------------------------------------------------------- */
export const logout: RequestHandler = async (req, res) => {
  res.clearCookie("jwt", {
    path: "/",
    maxAge: 7 * 24 * 3600 * 1000,
    httpOnly: true, // XSS
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(200).json({
    success: true,
    message: `Goodbye, ${req.user.name}!`,
  });
};

/* -------------------------------------------------------------------------- */
/*                                 GET PROFILE                                */
/* -------------------------------------------------------------------------- */
export const getProfile: RequestHandler = async (req, res) => {
  generateToken(req.user._id.toString(), res);

  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

/* -------------------------------------------------------------------------- */
/*                               UPDATE PROFILE                               */
/* -------------------------------------------------------------------------- */
export const updateProfile: RequestHandler = async (req, res) => {
  const user = (await User.findById(req.user._id))!;

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const image = req.files?.["profile-img"];
  const result = !!image ? await processImage(image.path) : null;
  if (result) {
    const ext = result.success ? ".webp" : extname(image.name);

    const { url } = await uploadFile({
      buffer: result.buffer,
      key: `profile-images/${user._id}-profile${ext}`,
      type: result.success ? "image/webp" : image.type,
    });

    if (url) user.profileImageUrl = url;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      profileImageUrl: user.profileImageUrl,
    },
    message: "Your profile was updated successffully",
  });
};

export const issueToken: RequestHandler = async (req, res) => {
  const { code } = await Token.createInvite();

  res.status(201).json({
    success: true,
    data: code,
    message: "Token generated successfully",
  });
};
