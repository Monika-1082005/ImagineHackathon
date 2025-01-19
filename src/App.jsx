import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Process from './components/Process';
import CropImpactCards from './components/CropImpactCards';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DiseaseDetector from './components/DiseaseDetector';
import Dashboard from './components/Dashboard';
import CropBasedOnSoil from './components/CropBasedOnSoil'; // Import the CropBasedOnSoil component
import CropRotation from './components/CropRotation'; // Import the CropRotation component
// import TreatmentPredictor from './components/Treatment';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  // const location = useLocation();

  // Check if the current route is '/croprotation'
  // const isCropRotationPage = location.pathname === '/croprotation';

  return (
    <Router>
      {/* Render Navbar for all pages */}
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Process />
              <CropImpactCards />
              <Testimonials />
              <Footer />
            </>
          }
        />
        <Route
          path="/detection"
          element={
            <>
              <DiseaseDetector />
              <Footer />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <div className="min-h-screen">
                <Dashboard />
              </div>
              <Footer />
            </>
          }
        />
        <Route
          path="/cropbasedonsoil"
          element={
            <>
              <CropBasedOnSoil /> {/* Only display CropBasedOnSoil */}
              <Footer /> {/* Include Footer */}
            </>
          }
        />
        
        {/* Only render CropRotation, Navbar, and Footer on /croprotation */}
        <Route
          path="/croprotation"
          element={
              <>
                <CropRotation /> {/* Render CropRotation content */}
                <Footer /> {/* Footer will still be included */}
              </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
