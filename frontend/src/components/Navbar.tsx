import React from "react";
import { Link } from "react-router-dom"; // Ensure you use React Router if navigating between pages.

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link to="/">HRMDD Raffle</Link>
        </div>
        <div className="space-x-4">
          <Link to="/upload-names" className="text-white hover:underline">
            Upload Names
          </Link>
          <Link to="/winner" className="text-white hover:underline">
            Winner List
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
