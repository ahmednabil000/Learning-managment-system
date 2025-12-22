import axios from "axios";

const CLOUD_NAME = "Learning_Management_System";
const UPLOAD_PRESET = "ml_default"; // Assuming a default or common preset name

const CloudinaryService = {
  uploadFile: async (file, resourceType = "auto") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUD_NAME
      }/${resourceType}/upload`,
      formData
    );

    return response.data.secure_url;
  },
};

export default CloudinaryService;
