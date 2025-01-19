import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import img1 from "../images/Camera.png";
import img2 from "../images/Question2.png";
import img3 from "../images/Solution.png";
import img4 from "../images/Analyze.png";

const STEPS = [
  {
    title: "Scan Your Crop",
    description: "Easily upload clear images of your crops or leverage live detection to get instant feedback. Ensure your plants get the attention they deserve with cutting-edge technology.",
    image: img1,
  },
  {
    title: "Identify Issues",
    description: "Harness the power of AI for precise diagnosis of crop diseases. Spot problems early and address them effectively to safeguard your harvest.",
    image: img2,
  },
  {
    title: "Get Solutions",
    description: "Receive personalized, expert-recommended treatments and preventive measures tailored to your crop’s specific needs for healthier and more robust plants.",
    image: img3,
  },
  {
    title: "Take Action",
    description: "Implement suggested solutions with confidence and monitor the progress of your crop's health. Stay proactive and ensure sustained productivity.",
    image: img4,
  },
];

const Process = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0vw", "-100vw", "-300vw"]
  );

  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div
      className="bg-gray-100 min-h-[400vh] relative"
      ref={containerRef}
      id="process"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 " />

      {/* Introductory Section */}
      <motion.div
        style={{ y }}
        className="sticky top-0 z-10 px-8 py-16 bg-white text-center bg-gradient-to-b from-green-100 to-green-200"
      >
        <h2 className="text-4xl font-bold text-gray-800">
          Simplified Crop Management
        </h2>
        <p className="text-lg text-gray-600 mt-4">
          Managing your crops has never been easier. Follow these steps to
          leverage the power of AI for smarter, more effective farming
          solutions.
        </p>
      </motion.div>

      {/* Horizontal Scroll Section */}
      <motion.div
        style={{ x }}
        className="w-[400vw] h-screen flex gap-8 px-8 sticky top-[25%]"
      >
        {STEPS.map((step, index) => (
          <div
            key={index}
            className="w-screen h-[70vh] flex justify-center items-center"
          >
            <div
              className="w-[80vw] bg-gradient-to-r from-green-300 via-green-200 to-green-100 rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 items-center gap-6"
            >
              <div className="flex justify-center items-center">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-[250px] h-[250px] object-contain rounded-md"
                />
              </div>
              <div className="flex flex-col gap-4 text-left">
                <h3 className="text-3xl font-semibold text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Process;
