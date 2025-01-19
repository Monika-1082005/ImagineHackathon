import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../images/logo.png'; // Ensure this path is correct

const navItems = [
  { name: 'Home', link: '/' },
  { name: 'Detection', link: '/detection' },
  { name: 'Consultation', link: '/chatbot' },
  { name: 'Crop Recommendation', link: '/cropbasedonsoil' }, // New section
  { name: 'Crop Rotation', link: '/croprotation' }, // New section
  { name: 'Dashboard', link: '/dashboard' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-1">
        {/* Logo section */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-24 w-32 object-contain" // Adjust height but maintain aspect ratio
            />
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex flex-grow justify-center">
          <ul className="flex space-x-8">
            {navItems.map((item, index) => (
              <li key={index} className="my-2">
                <Link
                  to={item.link}
                  className={`${
                    location.pathname === item.link
                      ? 'bg-green-600 text-white'
                      : 'text-black'
                  } font-medium px-4 py-2 rounded-md transition-all duration-300 hover:bg-green-600 hover:text-white`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden ml-auto">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} color="black" /> : <FaBars size={24} color="black" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-40">
            <ul className="flex flex-col items-center space-y-4 py-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-gray-800 font-medium px-4 py-2 rounded-md transition-all duration-300 hover:bg-green-600 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
