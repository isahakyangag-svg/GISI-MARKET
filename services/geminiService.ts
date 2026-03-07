
import { Product, Language } from "../types";

/**
 * Обогащает данные о товаре через серверный API
 */
export const enrichProductWithAI = async (brand: string, model: string): Promise<Partial<Product> & { sources?: any[] }> => {
  try {
    const response = await fetch('/api/ai/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, model })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI Enrichment failed:", error);
    return {};
  }
};

/**
 * Чат с ассистентом через серверный API
 */
export const chatWithAssistant = async (history: {role: string, text: string}[], message: string, lang: Language = 'ru'): Promise<string> => {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || "Ошибка связи.";
  } catch (error) {
    console.error("AI Chat failed:", error);
    return "Извините, произошла ошибка при общении с ИИ. Пожалуйста, попробуйте позже.";
  }
};
