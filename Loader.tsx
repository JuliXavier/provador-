
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
        <p className="mt-4 text-lg font-semibold text-gray-300">A IA está criando sua imagem...</p>
        <p className="text-sm text-gray-500">Isso pode levar alguns instantes.</p>
    </div>
  );
};

export default Loader;