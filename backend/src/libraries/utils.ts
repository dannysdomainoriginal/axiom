import fs from "fs/promises";
import sharp from "sharp";

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
