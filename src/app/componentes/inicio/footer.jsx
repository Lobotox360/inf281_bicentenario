import React from 'react';
import { FaFacebook, FaYoutube, FaTiktok, FaTwitter } from 'react-icons/fa';

const PiePagina = () => {
  return (
    <footer className="bg-green-700 p-6 text-center mt-auto">
      <p className="text-white">&copy; 2025 Bicentenario de Bolivia</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a
          href="https://www.facebook.com/profile.php?id=61561370416171"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-white text-2xl cursor-pointer hover:text-blue-500" />
        </a>
        <a
          href="https://www.youtube.com/@BicentenarioBolivia2025"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube className="text-white text-2xl cursor-pointer hover:text-red-500" />
        </a>
        <a
          href="https://www.tiktok.com/@bicentenario.de.b"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTiktok className="text-white text-2xl cursor-pointer hover:text-pink-500" />
        </a>
        <a
          href="https://twitter.com/delegaPresiden"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter className="text-white text-2xl cursor-pointer hover:text-blue-400" />
        </a>
      </div>
    </footer>
  );
};

export default PiePagina;
