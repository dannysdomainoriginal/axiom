import { UserI } from "@/models/User";
import "express";

interface UploadedFile {
  fieldName: string;
  name: string;
  path: string;
  size: number;
  type: string;
  headers: {
    "content-disposition": string;
    "content-type": string;
  };
}

declare module "express-serve-static-core" {
  interface Request {
    user: Omit<UserI, "password">;
    files: { [key: string]: UploadedFile };
  }
}
