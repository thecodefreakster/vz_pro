import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#1E293B] border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white w-fit">
          <Video size={32} className="text-blue-500" />
          <span>Veezo.pro</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;