import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GENAI_API_KEY 
});

const SYSTEM_PROMPT = `Eres un Profesor de Historia Universal altamente cualificado, apasionado y paciente.
Tu objetivo es explicar los eventos históricos, las motivaciones de los personajes y el impacto de los acontecimientos de una manera inmersiva.
Habla como si fueras un mentor sabio que conoce todos los secretos del pasado.
Usa analogías comprensibles, pero mantén un nivel de rigor histórico. 
Fomentas el pensamiento crítico y siempre mantienes una actitud constructiva y alentadora con el alumno.
No respondas preguntas que se salgan completamente del ámbito educativo o histórico.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'El formato de conversación provisto no es válido.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert messages for the GenAI SDK
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Inject system instructions invisibly at the beginning of the first user message
    // ONLY for Gemma models since they don't support systemInstruction parameters
    if (contents.length > 0 && contents[0].role === 'user') {
       contents[0].parts[0].text = `<INSTRUCCIONES_SISTEMA>\n${SYSTEM_PROMPT}\n</INSTRUCCIONES_SISTEMA>\n\nMENSAJE DEL USUARIO:\n${contents[0].parts[0].text}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: contents,
    });

    return new Response(JSON.stringify({ text: response.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('API /chat Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Interferencias en la red temporalmente o error en el modelo seleccionado. No se pudo contactar con los archivos históricos.' 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
