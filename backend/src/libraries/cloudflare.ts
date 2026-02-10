import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { fallBackUploader } from "./utils";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

type FileProps =
  | { path: string; buffer?: never; key: string; type: string }
  | { buffer: Buffer; path?: never; key: string; type: string };

// Upload a file (stream or tmp path)
export const uploadFile = async ({ path, buffer, key, type }: FileProps) => {
  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: path ? fs.createReadStream(path) : buffer,
        ContentType: type,
      }),
    );

    return {
      key,
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
    };
  } catch (err: any) {
    if (["ECONNRESET", "ETIMEDOUT", "ENOTFOUND"].includes(err.code)) {
      return fallBackUploader({
        key,
        buffer: buffer || (await fs.promises.readFile(path)),
      });
    } else {
      throw err;
    }
  }
};

// Delete a file by key
export const deleteFile = async (key: string) => {
  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
      }),
    );
    return true;
  } catch (err) {
    console.error("R2 delete error:", err);
    return false;
  }
};
