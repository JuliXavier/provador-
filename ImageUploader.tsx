
import React, { useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
  onClearImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  title,
  description,
  onImageUpload,
  imagePreviewUrl,
  onClearImage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleComponentClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2 text-gray-300">{title}</h3>
      <div
        className="relative w-full aspect-square bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center text-center p-4 cursor-pointer hover:border-purple-500 hover:bg-gray-700 transition-all duration-300"
        onClick={handleComponentClick}
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        {imagePreviewUrl ? (
          <>
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearImage();
              }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
              aria-label="Remover imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" />
            </svg>
            <p className="font-semibold text-gray-400">Clique para carregar</p>
            <p className="text-xs mt-1">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;