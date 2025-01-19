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

function App() {
  return (
    <Router>
      <Navbar />
      {/* Add padding-top to create space below the Navbar */}
      <div className="pt-16">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="mt-8 mx-auto max-w-5xl">
                  <Hero />
                  <Process />
                  <CropImpactCards />
                  <Testimonials />
                </div>
                <Footer />
              </>
            }
          />
          <Route
            path="/detection"
            element={
              <>
                {/* <div className="mt-8 mx-auto max-w-5xl"> */}
                  <DiseaseDetector />
                {/* </div> */}
                <Footer />
              </>
            }
          />
          <Route
            path="/chatbot"
            element={
              <>
                <div className="mt-8 mx-auto max-w-5xl">
                  <Chatbot />
                </div>
                <Footer />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <div className="mt-8 mx-auto max-w-5xl min-h-screen">
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
                <div className="mt-8 mx-auto max-w-5xl">
                  <CropBasedOnSoil />
                </div>
                <Footer />
              </>
            }
          />
          <Route
            path="/croprotation"
            element={
              <>
                <div className="mt-8 mx-auto max-w-5xl">
                  <CropRotation />
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
