import { RequestHandler } from "express";
import { z, ZodError } from "zod";
import { isValidObjectId } from "mongoose";

export const validate = (schema: z.ZodType): RequestHandler => {
  return async (req, res, next) => {
    try {
      const parsedData = await schema.parseAsync(req.body);
      req.body = parsedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: error.issues[0].message,
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: "Error validating your request",
      });
    }
  };
};

export const validObjectId = (params: string[]): RequestHandler => {
  return async (req, res, next) => {
    const invalid = params.find((i) => !isValidObjectId(req.params[i]));

    return invalid
      ? res.status(400).json({
          success: false,
          status: 400,
          message: `Invalid ${invalid} passed in request url`,
        })
      : next();
  };
};
