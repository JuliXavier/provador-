import { GoogleGenAI, Modality } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the data url prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateStyledImage = async (
  personImageFile: File,
  outfitImageFile: File,
  details: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  const personImageBase64 = await fileToBase64(personImageFile);
  const outfitImageBase64 = await fileToBase64(outfitImageFile);

  const personImagePart = {
    inlineData: {
      data: personImageBase64,
      mimeType: personImageFile.type,
    },
  };

  const outfitImagePart = {
    inlineData: {
      data: outfitImageBase64,
      mimeType: outfitImageFile.type,
    },
  };

  let prompt = `Use a primeira imagem como referência do rosto e do corpo da pessoa, mantendo sua aparência natural, cor de pele, cabelo e proporções. Use a segunda imagem como referência do look (roupa, acessórios, sapatos), incluindo detalhes de cores, texturas e estilo.
Gere uma imagem realista, corpo inteiro, combinando o rosto da primeira imagem com o look da segunda imagem.
Mantenha proporções naturais, iluminação consistente e pose neutra, como se a pessoa estivesse vestindo o look. Não altere o rosto nem aplique efeitos irreais.`;
  
  if (details) {
    prompt += `\n\nAdicione os seguintes detalhes opcionais descritos pelo usuário: ${details}.`;
  }
  
  const textPart = {
      text: prompt,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        personImagePart,
        outfitImagePart,
        textPart
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Não foi possível gerar a imagem ou a resposta da IA não continha uma imagem.");
};