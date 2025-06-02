import { useState } from "react";
import axios from "axios";
import Detection from "./Detection";

const DiseaseDetector = () => {
  const [prediction, setPrediction] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `${backendUrl}/predict_treatments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data.prediction); // Update prediction state
    } catch (error) {
      console.error("Error during prediction:", error);
    }
  };

  return (
    <div>
      {/* <h1>Plant Disease Detector</h1> */}
      <Detection prediction={prediction} />
    </div>
  );
};

export default DiseaseDetector;
