import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Configurações de segurança para permitir a conexão (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Se o navegador fizer uma verificação prévia, responde OK
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. Conecta na IA usando a chave que estará na Vercel
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { message } = req.body;

    const prompt = `
      Você é o Tekinho, o mascote e assistente virtual da contabilidade Contech.
      Seu tom é simpático, profissional e didático.
      Responda em Português do Brasil de forma concisa (máximo 3 parágrafos).
      Se a pergunta for técnica, explique de forma simples.
      O usuário perguntou: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erro na API:", error);
    res.status(500).json({ reply: "Ops! Tive um problema de conexão. Tente novamente." });
  }
}