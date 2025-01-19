import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#54dc5c] text-black py-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start">
        {/* Logo and description */}
        <div className="mb-8 md:mb-0 md:w-1/3">
          <h2 className="text-3xl font-bold">PlantBuddy</h2>
          <p className="text-sm mt-4">
            Protecting crops, preserving yields, and ensuring a sustainable future for farming.
          </p>
          <p className="text-sm mt-2">Empowering farmers with eco-friendly solutions.</p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 md:mb-0 md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:underline hover:text-slate-700">About Us</a></li>
            <li><a href="/services" className="hover:underline hover:text-slate-700">Our Services</a></li>
            <li><a href="/contact" className="hover:underline hover:text-slate-700">Contact</a></li>
            <li><a href="/blog" className="hover:underline hover:text-slate-700">Blog</a></li>
          </ul>
        </div>

        {/* Newsletter and Social Icons */}
        <div className="md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm mb-4">
            Subscribe to our newsletter for the latest updates on sustainable farming practices.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-l-md border border-gray-300 focus:outline-none w-full"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800"
            >
              Subscribe
            </button>
          </form>
          <div className="flex space-x-4 mt-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} className="hover:text-slate-600" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} className="hover:text-slate-600" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} className="hover:text-slate-600" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} className="hover:text-slate-600" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 text-sm border-t border-gray-300 pt-6">
        <p>&copy; 2025 PlantBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
