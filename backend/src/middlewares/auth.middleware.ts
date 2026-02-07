import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import httpError, { HttpError } from "http-errors";
import { Request, RequestHandler } from "express";

export const protect: RequestHandler = async (req: Request, res, next) => {
  try {
    const { jwt: token } = req.cookies as { jwt: string };

    if (!token)
      throw httpError.Unauthorized("401 Unauthorized - No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as decodedToken;

    if (!decoded) throw httpError[403]("403 Forbidden - Your token is invalid");

    const user = await User.findById(decoded.userId)
      .select("-password")
      .lean({ versionKey: false });

    if (!user) throw httpError[404]("No user exists with the given ID");

    req.user = user;
    next();
  } catch (err: any) {
    if (err.status) {
      return next(err);
    }

    console.log("JWT error: ", err.message);
    throw httpError[401]("Unauthorized - Authentication failed");
  }
};

/* -------------------------------------------------------------------------- */
/*                          AUTHORIZATION MIDDLEWARE                          */
/* -------------------------------------------------------------------------- */
export const requireRole = (role: Roles): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated." });
    }

    const userRoles = req.user.roles || [];
    const hasRole = userRoles.includes(role);

    return hasRole
      ? next()
      : res.status(403).json({
          message: "You are unauthorized.",
          required: role,
          userRoles,
        });
  };
};

export const adminOnly = requireRole("admin");
