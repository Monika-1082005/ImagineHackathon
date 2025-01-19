import EcologyImage from '../images/Ecology.png'; // Adjust path if necessary

const Hero = () => {
  return (
    <div className="bg-slate-100 flex flex-col lg:flex-row items-center justify-center min-h-screen pt-32 pb-24 mx-auto max-w-5xl px-6 lg:px-12 space-y-8 lg:space-y-0 lg:space-x-12">
      {/* Image section */}
      <img
        src={EcologyImage}
        alt="Crop Disease Prevention"
        className="w-72 h-72 mb-6 lg:mb-0"
      />

      {/* Text content section */}
      <div className="text-center lg:text-left">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">
          Protect Your Crops, Maximize Your Harvest
        </h2>
        <p className="text-gray-700 text-lg">
          Detect crop diseases early and implement effective solutions to prevent loss. Empower your farming practices with technology that ensures healthier crops and improved yields.
        </p>
      </div>
    </div>
  );
};

export default Hero;
