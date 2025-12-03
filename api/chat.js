import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Configuração de segurança (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Chave não configurada");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const { message } = req.body;

    const prompt = `
      Você é o Tekinho, assistente da Contech. Responda de forma curta e amigável.
      Usuário: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erro API:", error);
    // Mostra o erro detalhado se falhar
    res.status(500).json({ reply: "Erro técnico: " + error.message });
  }
}