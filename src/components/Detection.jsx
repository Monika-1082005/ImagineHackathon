import { useState } from "react";

const Detection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [treatment, setTreatment] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", selectedImage);
  
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Error occurred while making the prediction");
      }
  
      const data = await response.json();
      setPrediction(data.prediction || "No prediction available");
    } catch (error) {
      console.error("Error:", error.message);
      setPrediction("Failed to make a prediction: " + error.message);
    }
  };

  const handleViewTreatment = async () => {
    if (!prediction) {
      alert("Please detect the disease first.");
      return;
    }

    // Split the prediction into plant name and disease name
    const [plantName, diseaseName] = prediction.split(", ");
    
    try {
      const response = await fetch("http://localhost:5004/predict", { // Updated port to match Flask server
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plant: plantName.trim().toLowerCase(),
          disease: diseaseName.trim().toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Error occurred while getting treatment");
      }

      const data = await response.json();
      setTreatment(data);
    } catch (error) {
      console.error("Error:", error.message);
      setTreatment(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-16 bg-gray-50">
      <h1 className="text-3xl font-bold text-black mb-8">Plant Disease Detection</h1>
      <div className="bg-[#54dc5c] p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white hover:file:bg-gray-700"
        />
        <button
          onClick={handleDetect}
          className="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition"
        >
          Detect Disease
        </button>
      </div>
      
      {preview && (
        <div className="mt-8">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
      
      {prediction && (
        <div className="bg-white mt-8 p-4 rounded-lg shadow-md w-full max-w-md">
          <p className="text-black font-medium">Prediction: {prediction}</p>
          <button
            onClick={handleViewTreatment}
            className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            View Treatment
          </button>
        </div>
      )}
      
      {treatment && (
        <div className="bg-white mt-8 p-4 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-black font-medium text-lg mb-4">Treatment Solutions</h2>
          <p className="text-black mb-2"><span className="font-semibold">Treatment 1:</span> {treatment.treatment_1}</p>
          <p className="text-black"><span className="font-semibold">Treatment 2:</span> {treatment.treatment_2}</p>
        </div>
      )}
    </div>
  );
};

export default Detection;