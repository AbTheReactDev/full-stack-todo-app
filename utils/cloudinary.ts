export const uploadToCloudinary = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.CLOUDINARY_UPLOAD_PRESET as string
    );
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dx2t9xael/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.log(error);
  }
};
