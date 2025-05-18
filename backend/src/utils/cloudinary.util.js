import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPublicId = (url) => {
  if (!url) return null;

  const isCloudinaryUrl = url.includes("res.cloudinary.com");
  if (!isCloudinaryUrl) return null;

  const parts = url.split("/");
  const fileWithExtension = parts.pop(); // htxuzii0el0qtavsjedn.jpg
  const [publicId] = fileWithExtension.split(".");

  // Skip version part (e.g., v1747600274)
  const uploadIndex = parts.indexOf("upload");
  const pathAfterUpload = parts.slice(uploadIndex + 1);

  // Remove version if it's like 'v1234567890'
  if (pathAfterUpload[0]?.startsWith("v") && /^\d+$/.test(pathAfterUpload[0].slice(1))) {
    pathAfterUpload.shift();
  }

  const folderPath = pathAfterUpload.join("/");
  return folderPath ? `${folderPath}/${publicId}` : publicId;
};

export const uploadMedia = async (file, type = "image", folder = "BolMitra/Default") => {
  return await cloudinary.uploader.upload(file, {
    resource_type: type,
    folder,
  });
};

export const deleteImage = async (imageUrl) => {

  const defaultProfileUrl = "https://res.cloudinary.com/dwckwrdvx/image/upload/v1747554396/Default_xltl9b.webp";
  if (imageUrl === defaultProfileUrl) return;

  const publicId = extractPublicId(imageUrl);
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};
