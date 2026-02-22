import Groq from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are Steve FX, a professional video editor portfolio assistant. Help visitors with questions about video editing services, rates, portfolio, and contact information. Be friendly, professional, and concise.'
        },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.status(200).json({ response });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
