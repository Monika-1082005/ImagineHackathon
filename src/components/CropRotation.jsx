import { useState } from "react";
import axios from "axios";

const CropRotation = () => {
  const [location, setLocation] = useState("");
  const [plant, setPlant] = useState("");
  const [rotation, setRotation] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRotation(null);

    try {
      const response = await axios.post("http://127.0.0.1:5003/rotate", {
        location,
        plant,
      });

      if (response.data.recommended_rotation_crop) {
        setRotation(response.data);
      } else {
        setError("No crop rotation available for this combination.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching crop rotation.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Crop Rotation System
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Current Plant:</label>
            <input
              type="text"
              value={plant}
              onChange={(e) => setPlant(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Get Crop Rotation
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-center">{`Error: ${error}`}</p>
        )}

        {rotation && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Crop Rotation:</h2>
            <p>
              <strong>Location:</strong> {rotation.location}
            </p>
            <p>
              <strong>Current Plant:</strong> {rotation.current_plant}
            </p>
            <p>
              <strong>Recommended Crop for Rotation:</strong>{" "}
              {rotation.recommended_rotation_crop ||
                "No crop rotation recommended"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRotation;
