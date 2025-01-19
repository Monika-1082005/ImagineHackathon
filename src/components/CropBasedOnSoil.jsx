import { useState } from "react";
import axios from "axios";

const CropBasedOnSoil = () => {
  const [formData, setFormData] = useState({
    N: 50,
    P: 50,
    K: 50,
    temperature: 25.0,
    humidity: 50.0,
    ph: 6.5,
    rainfall: 100.0,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("http://127.0.0.1:5002/predict", formData);
      if (response.status === 200) {
        setResult(response.data.recommended_crop);
      } else {
        setError("Unable to get a prediction. Please try again.");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#2E7D32" }}>Crop Recommendation System</h1>
      <p style={{ textAlign: "center", fontSize: "16px", color: "#555" }}>
        Enter the parameters below to get a recommendation for the most suitable crop.
      </p>

      {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map((field) => (
        <div key={field} style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          <input
            type="number"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            step={field === "ph" ? 0.1 : 1}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <small style={{ color: "#888", fontSize: "12px" }}>
            {field === "ph"
              ? "Enter pH level (e.g., 6.5)"
              : `Enter ${field} value (e.g., ${field === "temperature" ? "25.0°C" : "50"})`}
          </small>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#2E7D32",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        disabled={loading}
      >
        {loading ? "Predicting..." : "Predict Suitable Crop"}
      </button>

      {result && (
        <div style={{ marginTop: "20px", color: "green", textAlign: "center" }}>
          <h2>The most suitable crop to grow is:</h2>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>{result}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red", textAlign: "center" }}>
          <h2>{error}</h2>
        </div>
      )}
    </div>
  );
};

export default CropBasedOnSoil;
