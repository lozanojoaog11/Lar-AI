import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // Em um ambiente de produção real, você pode querer ter um tratamento de erro mais sofisticado.
  // Para este MVP, lançar um erro é suficiente para sinalizar um problema de configuração.
  console.error("API_KEY do Gemini não encontrada. Por favor, configure a variável de ambiente.");
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Analisa um data URL para extrair o tipo MIME e os dados em base64.
 * @param dataUrl O data URL a ser analisado.
 * @returns Um objeto contendo o tipo MIME e os dados em base64.
 */
function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const parts = dataUrl.split(',');
  if (parts.length !== 2) {
    throw new Error('Formato de data URL inválido');
  }
  const metaPart = parts[0];
  const data = parts[1];
  
  const mimeTypeMatch = metaPart.match(/:(.*?);/);
  if (!mimeTypeMatch || !mimeTypeMatch[1]) {
    throw new Error('Não foi possível extrair o tipo MIME do data URL');
  }
  const mimeType = mimeTypeMatch[1];
  
  return { mimeType, data };
}


/**
 * Gera uma imagem de um cômodo com base num estilo e numa imagem de entrada do usuário usando a API Gemini.
 * @param styleName O nome do estilo de design (ex: "Moderno", "Industrial").
 * @param userImageBase64Url O data URL da imagem enviada pelo usuário.
 * @returns Uma promessa que resolve para um data URL em base64 da imagem gerada.
 */
export async function generateRoomImage(styleName: string, userImageBase64Url: string): Promise<string> {
  try {
    const { mimeType, data: imageBytes } = parseDataUrl(userImageBase64Url);

    // Etapa 1: Descrever o layout atual do cômodo, incluindo a mobília, para preservar a estrutura.
    const describePrompt = `Analise a imagem anexa de um cômodo. Descreva a cena em detalhes, focando nos elementos que definem o layout do espaço. Inclua a disposição dos móveis principais (ex: cama, sofá, mesa), a posição e o tipo de janelas e portas, e quaisquer características arquitetónicas visíveis (ex: lareira, viga, parede de destaque). O objetivo é capturar a estrutura e o layout espacial do cômodo como ele está agora, para que possa ser redecorado.`;
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBytes,
      },
    };
    const textPart = { text: describePrompt };

    const descriptionResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    const roomDescription = descriptionResponse.text;
    if (!roomDescription) {
        throw new Error("Não foi possível gerar a descrição da sala.");
    }

    // Etapa 2: Gerar a nova imagem, instruindo a IA a manter o layout e aplicar o novo estilo.
    const generationPrompt = `Você é um designer de interiores de IA. Sua tarefa é reimaginar um cômodo existente.
DESCRIÇÃO DO CÔMODO ATUAL: "${roomDescription}"
NOVO ESTILO A APLICAR: "${styleName}"

INSTRUÇÕES:
Crie uma fotografia fotorrealista de alta qualidade que mostre o cômodo descrito acima, mas completamente redecorado no estilo "${styleName}".
É CRUCIAL que você MANTENHA O LAYOUT ORIGINAL. A posição e o tamanho das janelas, portas, e a disposição geral dos móveis principais devem permanecer os mesmos.
NÃO altere a perspectiva ou o ângulo da câmera.
ALTERE APENAS: o estilo dos móveis, as cores das paredes, os materiais do piso, os objetos de decoração, as luminárias e os têxteis para que correspondam perfeitamente ao estilo "${styleName}".
O resultado deve parecer uma reforma profissional do espaço original, não um cômodo completamente diferente.`;

    const imageResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: generationPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
      throw new Error("A API não retornou nenhuma imagem.");
    }

    const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error(`Erro ao gerar imagem com o Gemini:`, error);
    // Propaga uma mensagem de erro mais amigável para a UI
    throw new Error("Falha ao gerar a imagem de IA. Por favor, verifique a consola para mais detalhes.");
  }
}
