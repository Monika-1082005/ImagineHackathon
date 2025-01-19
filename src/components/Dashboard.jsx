import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analysis data from the Flask backend
    axios
      .get("http://127.0.0.1:5001/analyze")
      .then((response) => {
        setAnalysisData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError(`Error fetching analysis: ${err.message}`);
        setAnalysisData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading analysis...</h2>;
  }

  if (error) {
    return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;
  }

  if (!analysisData) {
    return <h2 style={{ textAlign: "center" }}>No analysis data available.</h2>;
  }

  // Destructure the data for easier access
  const { yearly_trends, crop_distribution, correlation_data } = analysisData;

  // Limit crop_distribution to the top 10 crops
  const topCropDistribution = crop_distribution
    .sort((a, b) => b.value - a.value) // Sort by value in descending order
    .slice(0, 10); // Take the top 10 crops

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF5F57"];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#2E7D32" }}>Crop Yield Analysis Dashboard</h1>
      <p style={{ textAlign: "center", fontSize: "16px", color: "#555" }}>
        Explore crop yield trends and insights over the years.
      </p>

      {/* Yearly Trends Line Chart */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#2E7D32" }}>Yearly Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearly_trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="yield" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Crop Distribution Pie Chart */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#2E7D32" }}>Top 10 Crops Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topCropDistribution}
              dataKey="value"
              nameKey="crop"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={(entry) => `${entry.crop}: ${entry.value}`}
            >
              {topCropDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Correlation Bar Chart */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#2E7D32" }}>Correlation Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={correlation_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="factor" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="correlation" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
