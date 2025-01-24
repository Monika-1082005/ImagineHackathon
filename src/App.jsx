import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Process from './components/Process';
import CropImpactCards from './components/CropImpactCards';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DiseaseDetector from './components/DiseaseDetector';
import Dashboard from './components/Dashboard';
import CropBasedOnSoil from './components/CropBasedOnSoil';
import CropRotation from './components/CropRotation';
import Chatbot from './components/Chatbot';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

// Layout Component for common structure
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="pt-20"> {/* Increased padding to prevent overlap */}
        {children}
      </div>
      <Footer />
    </>
  );
};

// PropTypes for Layout component
Layout.propTypes = {
  children: PropTypes.node.isRequired, // Ensures that children is required and of type node
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Hero /><Process /><CropImpactCards /><Testimonials /></Layout>} />
        <Route path="/detection" element={<Layout><DiseaseDetector /></Layout>} />
        <Route path="/chatbot" element={<Layout><Chatbot /></Layout>} />
        <Route path="/cropbasedonsoil" element={<Layout><CropBasedOnSoil /></Layout>} />
        <Route path="/croprotation" element={<Layout><CropRotation /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
