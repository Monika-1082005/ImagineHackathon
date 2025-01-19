import { useState } from "react";
import axios from "axios";

const Treatment = () => {
  const [plant, setPlant] = useState("");
  const [disease, setDisease] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setError("");
    setResult(null);

    if (!plant || !disease) {
      setError("Please enter both plant and disease.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000 /predict", {
        plant: plant.trim(),
        disease: disease.trim(),
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while processing your request.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", textAlign: "center", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h1>Plant Disease Treatment Predictor</h1>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Enter Plant Name"
          value={plant}
          onChange={(e) => setPlant(e.target.value)}
          style={{ padding: "10px", width: "80%", marginBottom: "10px" }}
        />
        <br />
        <input
          type="text"
          placeholder="Enter Disease Name"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          style={{ padding: "10px", width: "80%" }}
        />
      </div>
      <button
        onClick={handlePredict}
        style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Predict Treatments
      </button>
      <div style={{ marginTop: "20px" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result && (
          <div>
            <h3>Prediction Results:</h3>
            <p><strong>Plant:</strong> {result.plant}</p>
            <p><strong>Disease:</strong> {result.disease}</p>
            <p><strong>Treatment 1:</strong> {result.treatment_1}</p>
            <p><strong>Treatment 2:</strong> {result.treatment_2}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Treatment;
