require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dbjii2d8s',
  api_key: '652198285858825',
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

exports.uploadImage = async (imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.url;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

exports.createImageTag = (publicId, transformation = {}) =>
  cloudinary.image(publicId, transformation);
