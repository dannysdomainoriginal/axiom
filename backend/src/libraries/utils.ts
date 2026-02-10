import sharp from "sharp";
import fs from "fs-extra";
import { join } from "path";
import { logger } from "./logger";

export const processImage = async (imgPath: string) => {
  const buffer = await fs.readFile(imgPath);

  try {
    const webp = await sharp(buffer)
      .resize({ width: 512 })
      .webp({ quality: 80 })
      .toBuffer();

    return {
      success: true,
      buffer: webp,
    };
  } catch (err) {
    return {
      success: false,
      buffer,
    };
  }
};

interface FallBackProps {
  key: string;
  buffer: Buffer;
}

export const fallBackUploader = async ({ key, buffer }: FallBackProps) => {
  try {
    const uploadsDir = join(process.cwd(), "uploads");
    await fs.ensureDir(uploadsDir);
    await fs.outputFile(join(uploadsDir, key), buffer);

    logger.info("Successfully used fallback uploader to avoid network errors");

    return {
      key: undefined,
      url: `http://localhost:${process.env.PORT}/uploads/${key}`,
    };
  } catch (err: any) {
    logger.error("Error using fallBackUploader: " + err.message);
    return { url: undefined };
  }
};
