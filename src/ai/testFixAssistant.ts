import { LlmClient } from './llmClient';

export interface FailedTestContext {
  testName: string;
  testFilePath: string;
  testCode: string; // код тесту, що впав
  errorMessage: string;
  stackTrace: string;
  url?: string;
  screenshotPath?: string;
}

export interface TestFixSuggestion {
  description: string;
  suggestedChanges: string; // diff або повний код виправлення
  confidence: 'Low' | 'Medium' | 'High';
}

export class TestFixAssistant {
  private llm: LlmClient;

  constructor(llmClient?: LlmClient) {
    this.llm = llmClient ?? new LlmClient();
  }

  async suggestFix(context: FailedTestContext): Promise<TestFixSuggestion> {
    const systemPrompt = `
        You are a senior QA automation engineer specializing in Playwright + TypeScript.
        Given a failed test, you analyze the error and suggest a fix.

        Return JSON with keys:
        - description: brief explanation of the issue
        - suggestedChanges: code snippet or diff to fix the test
        - confidence: Low | Medium | High
        `;

    const userPrompt = `
        Test name: ${context.testName}
        Test file: ${context.testFilePath}
        URL: ${context.url ?? 'unknown'}

        Error message:
        ${context.errorMessage}

        Stack trace:
        ${context.stackTrace}

        Test code:
        \`\`\`ts
        ${context.testCode}
        \`\`\`

        Analyze the failure and suggest a fix.
        `;

    try {
      const raw = await this.llm.generateText(systemPrompt, userPrompt);

      let parsed: any;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : raw;
        parsed = JSON.parse(jsonString);
      } catch {
        // fallback if JSON parsing fails
        parsed = {
          description: 'Unable to parse LLM response',
          suggestedChanges: raw,
          confidence: 'Low',
        };
      }

      return {
        description: parsed.description ?? 'No description',
        suggestedChanges: parsed.suggestedChanges ?? raw,
        confidence: parsed.confidence ?? 'Medium',
      };
    } catch (err: any) {
      const msg = (err && err.message) ? err.message : String(err);
      // Check for credential errors
      if (msg.includes('Missing credentials') || msg.includes('OPENAI_API_KEY')) {
        console.error(`[AI] OpenAI credentials missing: ${msg}`);
        return {
          description: 'AI test fix assistant unavailable - OpenAI credentials not configured',
          suggestedChanges: 'Please configure OPENAI_API_KEY environment variable to enable AI-powered test fixes.',
          confidence: 'Low',
        };
      }

      // Other LLM errors
      console.error('[AI] Error while generating test fix suggestion:', err);
      return {
        description: `Error generating suggestion: ${msg}`,
        suggestedChanges: `Failed to generate fix suggestion. Error: ${msg}`,
        confidence: 'Low',
      };
    }
  }
}
