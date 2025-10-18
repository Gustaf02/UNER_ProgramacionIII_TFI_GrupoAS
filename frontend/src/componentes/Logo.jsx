import React from 'react';
import { ServerIcon } from '@heroicons/react/24/outline';
import { Storage } from '@mui/icons-material';
import { FaDatabase } from 'react-icons/fa6';

const Logo = () => {
  return (
    <div className="inline-flex items-center justify-center rounded-xl ">
      <div className="relative">
        <Storage className="h-4 w-4" />
        <FaDatabase className="absolute -bottom-1 -right-1 h-4 w-4 text-yellow-300" />
      </div>
    </div>
  );
};

export default Logo;