import OpenAI from 'openai';

export class LlmClient {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey ?? process.env.OPENAI_API_KEY,
    });
  }

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini', // або іншу модель
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    });
    console.log(`[LLM] Response received: ${JSON.stringify(response, null, 2)}`);

    return response.choices[0].message.content ?? '';
  }
}
