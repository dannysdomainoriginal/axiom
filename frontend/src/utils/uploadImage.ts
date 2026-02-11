import { apiPaths } from "./apiPaths";
import api from "@/libraries/axios";

type ImageResponse = { url: string };

const uploadImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const res = await api.post<ImageResponse>("/images/upload", formData);
    return res.data;
  } catch (err: any) {
    console.log("Error uploading the image: ", err);
    throw err;
  }
};

export default uploadImage;
