import { GoogleGenAI } from "@google/genai";
import { AppDocument } from "../types";

// Initialize the client lazily
let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || 'dummy_key_to_prevent_crash';
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

const SYSTEM_INSTRUCTION_BASE = `
Tu es "Conisia AI", l'assistant intelligent de l'intranet de MyUnisoft.
Ton rôle est d'aider les collaborateurs à trouver des documents, des procédures et des informations internes.
Instructions de formatage :
1. Structure TOUJOURS tes réponses de manière claire (Markdown).
2. Utilise des listes à puces pour énumérer des points.
3. Mets en GRAS les mots-clés importants.
4. Si on te pose une question sur un document spécifique, vérifie s'il est dans la liste fournie.
`;

export const askConisia = async (query: string, documentContext: AppDocument[] = [], useWeb: boolean = false): Promise<string> => {
  try {
    // Construct context string from documents
    const docList = documentContext.map(d => 
      `- [${d.type}] ${d.name} (Tags: ${d.tags.join(', ')}, Desc: ${d.aiDescription || 'N/A'})`
    ).join('\n');

    let contextInstruction = `
    Voici la liste des documents disponibles sur la plateforme actuellement (contexte interne) :
    ${docList}
    `;

    if (useWeb) {
        contextInstruction += `
        \nIMPORTANT : L'utilisateur a activé la recherche WEB.
        Tu as accès à l'outil 'googleSearch'. Utilise-le pour trouver des informations RÉELLES et À JOUR sur internet si la demande de l'utilisateur le nécessite (ex: actualités, lois récentes, concurrents, définitions générales).
        Si la réponse vient du web, cite tes sources ou mentionne que l'info est externe.
        `;
    } else {
        contextInstruction += `\nUtilise ces informations internes pour répondre. Si l'utilisateur cherche un document, indique-lui s'il existe.`;
    }

    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION_BASE + contextInstruction,
    };

    // Add Google Search tool if requested
    if (useWeb) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await getAiClient().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: config,
    });

    return response.text || "Désolé, je n'ai pas pu accéder à cette information pour le moment.";
  } catch (error) {
    console.error("Error querying Conisia AI:", error);
    return "Une erreur est survenue lors de la communication avec le serveur d'intelligence artificielle.";
  }
};

export const summarizeFile = async (docName: string, docContext: AppDocument[]): Promise<string> => {
  try {
    const doc = docContext.find(d => d.name === docName);
    const context = doc 
      ? `Informations connues sur le fichier: Type ${doc.type}, Tags: ${doc.tags.join(', ')}, Description Auto: ${doc.aiDescription}`
      : "Le fichier est mentionné mais je n'ai pas son contenu brut.";

    const prompt = `
      Génère un résumé concis et structuré pour le document intitulé "${docName}".
      ${context}
      
      Si tu n'as pas accès au contenu complet, base-toi sur le titre, les tags et la description fournie pour déduire son utilité.
    `;

    const response = await getAiClient().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });

    return response.text || "Impossible de générer le résumé.";
  } catch (error) {
    return "Erreur lors de la génération du résumé.";
  }
};

export const analyzeRequestAndGenerateSteps = async (
  title: string, 
  description: string, 
  department: string
): Promise<string[]> => {
  try {
    const prompt = `
      Contexte: Un employé crée une demande interne pour le département ${department}.
      Titre: ${title}
      Description: ${description}

      Tâche: Analyse cette demande et décompose-la en 3 à 5 étapes concrètes et réalisables.
      Format de réponse attendu: JSON Array of strings.
    `;

    const response = await getAiClient().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || "[]";
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating steps:", error);
    return ["Analyser la demande", "Prendre contact avec le demandeur", "Exécuter la tâche"];
  }
};

export const analyzeImageContent = async (base64Data: string, mimeType: string): Promise<string> => {
    try {
        const response = await getAiClient().models.generateContent({
            model: 'gemini-3.1-pro-preview', // Requested model for image analysis
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    },
                    {
                        text: "Analyse ce document/image. Donne-moi une courte description (1-2 phrases) et liste 3 mots-clés pertinents."
                    }
                ]
            }
        });
        return response.text || "Analyse impossible.";
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Erreur lors de l'analyse IA.";
    }
}
