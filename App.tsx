import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import TextAreaInput from './components/TextAreaInput';
import Loader from './components/Loader';
import { generateStyledImage } from './services/geminiService';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [outfitImage, setOutfitImage] = useState<File | null>(null);
  const [details, setDetails] = useState('');

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFilePreview = (file: File | null): string | null => {
    return file ? URL.createObjectURL(file) : null;
  };

  const handleGenerateClick = useCallback(async () => {
    if (!personImage || !outfitImage) {
      setError('Por favor, carregue a imagem da pessoa e do look.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const generatedImgSrc = await generateStyledImage(
        personImage,
        outfitImage,
        details
      );
      setGeneratedImage(generatedImgSrc);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Erro ao gerar imagem: ${err.message}`
          : 'Ocorreu um erro desconhecido.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [personImage, outfitImage, details]);

  const isButtonDisabled = !personImage || !outfitImage || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Provador Virtual IA
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Provador Virtual Inteligente
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Controls Column */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-200 border-b border-gray-700 pb-3">Configurações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader
                id="person-image"
                title="1. Imagem da Pessoa"
                description="Rosto e corpo para referência."
                onImageUpload={setPersonImage}
                imagePreviewUrl={getFilePreview(personImage)}
                onClearImage={() => setPersonImage(null)}
              />
              <ImageUploader
                id="outfit-image"
                title="2. Imagem do Look"
                description="Roupa, estilo e acessórios."
                onImageUpload={setOutfitImage}
                imagePreviewUrl={getFilePreview(outfitImage)}
                onClearImage={() => setOutfitImage(null)}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Detalhes Adicionais</h3>
               <TextAreaInput
                id="details"
                label="Descreva o que mais você quer na imagem"
                placeholder="Ex: com óculos de sol, em um parque, com estilo casual..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
              />
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={isButtonDisabled}
              className={`w-full py-3 px-6 mt-4 font-bold text-lg rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105
                ${isButtonDisabled
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                }`}
            >
              {isLoading ? 'Gerando...' : 'Gerar Imagem'}
            </button>
          </div>

          {/* Result Column */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg flex items-center justify-center min-h-[400px] lg:min-h-0 border border-gray-700">
            {isLoading && <Loader />}
            {error && !isLoading && (
              <div className="text-center text-red-400">
                <p className="text-xl font-bold">Oops!</p>
                <p>{error}</p>
              </div>
            )}
            {generatedImage && !isLoading && (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-gray-200 mb-4 text-center">Resultado</h2>
                <img
                  src={generatedImage}
                  alt="Imagem gerada"
                  className="rounded-lg w-full h-auto object-contain max-h-[80vh] shadow-2xl"
                />
              </div>
            )}
            {!isLoading && !error && !generatedImage && (
              <div className="text-center text-gray-500">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
                <p className="mt-4 text-lg">Sua imagem aparecerá aqui</p>
                <p className="text-sm">Configure as opções e clique em "Gerar Imagem".</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;