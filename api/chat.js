import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Permissões de acesso (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Responde rápido se for verificação do navegador
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Conecta com a chave que estará na Vercel
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { message } = req.body;

    // Personalidade do Tekinho
    const prompt = `
      Você é o Tekinho, o mascote da contabilidade Contech.
      Seu tom é amigável, profissional e didático.
      Responda em Português do Brasil. Seja breve.
      O usuário perguntou: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Desculpe, tive um erro de conexão. Tente novamente." });
  }
}