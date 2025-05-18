import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to extract publicId from a Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;

  // Check if it's a valid Cloudinary URL
  const isCloudinaryUrl = url.includes("res.cloudinary.com");
  if (!isCloudinaryUrl) return null;

  const parts = url.split("/");
  const fileWithExtension = parts.pop();
  const [publicId] = fileWithExtension.split(".");

  // Handle nested folder structures, like user/profile/abc123
  const folderPath = parts.slice(parts.indexOf("upload") + 1).join("/");

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
