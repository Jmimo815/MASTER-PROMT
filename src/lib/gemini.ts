import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type PromptTechnique = "zero-shot" | "few-shot" | "chain-of-thought";

export interface PromptAnalysis {
  precision: number;
  feedbacks: string[];
  suggestions: {
    role?: string;
    task?: string;
    context?: string;
    format?: string;
  };
}

export interface RefinedPrompt {
  content: string;
  explanation: string;
}

export const analyzePromptPrecision = async (prompt: string): Promise<PromptAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analiza la precisión del siguiente prompt para una IA. 
    Evalúalo en una escala de 0 a 100 basándote en la claridad de: Rol, Tarea, Contexto y Formato de salida.
    Prompt: "${prompt}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          precision: { type: Type.NUMBER, description: "Puntuación de 0 a 100" },
          feedbacks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de puntos débiles identificados" },
          suggestions: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING, description: "Sugerencia para el Rol" },
              task: { type: Type.STRING, description: "Sugerencia para la Tarea" },
              context: { type: Type.STRING, description: "Sugerencia para el Contexto" },
              format: { type: Type.STRING, description: "Sugerencia para el Formato" },
            }
          }
        },
        required: ["precision", "feedbacks", "suggestions"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as PromptAnalysis;
  } catch (e) {
    return {
      precision: 0,
      feedbacks: ["Error al analizar el prompt"],
      suggestions: {}
    };
  }
};

export const refinePrompt = async (
  originalPrompt: string, 
  technique: PromptTechnique,
  role?: string,
  task?: string,
  context?: string,
  format?: string
): Promise<RefinedPrompt> => {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `Eres un experto en ingeniería de prompts. 
  Tu tarea es mejorar el prompt del usuario utilizando la técnica "${technique}".
  Debes seguir estrictamente la estructura: Rol + Tarea + Contexto + Formato de salida.
  
  Explicación de técnicas:
  - zero-shot: Instrucción directa sin ejemplos.
  - few-shot: Incluye ejemplos de entrada y salida para guiar a la IA.
  - chain-of-thought: Instruye a la IA para que piense paso a paso.`;

  const prompt = `Mejora este prompt: "${originalPrompt}"
  Detalles adicionales proporcionados por el usuario:
  - Rol: ${role || "No especificado"}
  - Tarea: ${task || "No especificado"}
  - Contexto: ${context || "No especificado"}
  - Formato: ${format || "No especificado"}
  
  Devuelve el prompt refinado y una breve explicación de qué se mejoró.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING, description: "El prompt refinado listo para usar" },
          explanation: { type: Type.STRING, description: "Explicación de las mejoras realizadas" }
        },
        required: ["content", "explanation"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as RefinedPrompt;
  } catch (e) {
    return {
      content: originalPrompt,
      explanation: "No se pudo refinar el prompt."
    };
  }
};
