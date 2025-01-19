import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Testimonials = () => {
  const testimonials = [
    {
      text: "This platform has transformed the way I manage my crops. The AI diagnosis is spot on, and the solutions provided are incredibly helpful!",
      name: "John Doe",
    },
    {
      text: "I’ve seen remarkable improvements in my yield since using this service. It’s intuitive and very reliable.",
      name: "Jane Smith",
    },
    {
      text: "Managing crops is now effortless. The live detection feature is simply amazing!",
      name: "Michael Johnson",
    },
  ];

  return (
    <div className="bg-gray-50 py-16 px-8 my-16">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-4">
        TESTIMONIALS
      </h2>
      <p className="text-xl text-center text-gray-700 mb-12">
        What Our Clients Say
      </p>

      <div className="relative flex items-center justify-center">
        <button className="absolute left-0 text-green-600 hover:text-green-800 transition">
          <MdChevronLeft size={32} />
        </button>

        <div className="flex gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-300 via-green-200 to-green-100 text-gray-800 rounded-lg shadow-lg p-6 w-[300px] flex flex-col items-center text-center transition-transform transform hover:scale-105"
            >
              <div className="text-gray-600">
                <FaQuoteLeft size={24} />
              </div>
              <p className="mt-4 mb-6">{testimonial.text}</p>
              <div className="text-gray-600">
                <FaQuoteRight size={24} />
              </div>
              <h3 className="text-lg font-semibold mt-4">{testimonial.name}</h3>
            </div>
          ))}
        </div>

        <button className="absolute right-0 text-green-600 hover:text-green-800 transition">
          <MdChevronRight size={32} />
        </button>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full ${
              index === 0 ? "bg-green-600" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
