import { LlmClient } from './llmClient';

export interface TestGenerationRequest {
  featureDescription: string;
  pageUrl?: string;
  pageElements?: string[]; // наприклад: ['#username', '#password', 'button[type="submit"]']
}

export class TestGenerator {
  private llm: LlmClient;

  constructor(llmClient?: LlmClient) {
    this.llm = llmClient ?? new LlmClient();
  }

  /**
   * Генерує список тест-кейсів (текстом) з опису фічі
   */
  async generateTestCases(request: TestGenerationRequest): Promise<string[]> {
    const systemPrompt = `
            You are a senior QA engineer. Given a feature description,
            you generate a list of concise end-to-end UI test cases.
            Return only a numbered Markdown list (one test case per line).
            `;

    const userPrompt = `
            Feature description:
            ${request.featureDescription}

            ${request.pageUrl ? `Page URL: ${request.pageUrl}` : ''}
            ${request.pageElements ? `Page elements: ${request.pageElements.join(', ')}` : ''}

            Generate 5-7 UI test cases.
            `;

    try {
      const result = await this.llm.generateText(systemPrompt, userPrompt);
      return result
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);
    } catch (err: any) {
      const msg = (err && err.message) ? err.message : String(err);
      console.error('[AI] Error generating test cases:', msg);
      // Return safe fallback
      return [
        `Verify that feature works: ${request.featureDescription}`,
        `Verify that error handling works for: ${request.featureDescription}`,
      ];
    }
  }

  /**
   * Генерує готовий Playwright test skeleton (TypeScript)
   */
  async generatePlaywrightTest(request: TestGenerationRequest): Promise<string> {
    const systemPrompt = `
        You are a senior QA automation engineer using Playwright + TypeScript.
        Generate a complete Playwright test file with:
        - proper imports from '@playwright/test'
        - test.describe block
        - multiple test() blocks covering main scenarios
        - Page Object Model style (if applicable)
        - proper locators and assertions

        Use modern Playwright best practices.
        Return ONLY the TypeScript code, no explanations.
        `;

    const userPrompt = `
            Feature description:
            ${request.featureDescription}

            ${request.pageUrl ? `Page URL: ${request.pageUrl}` : ''}
            ${request.pageElements ? `Page elements (selectors): ${request.pageElements.join(', ')}` : ''}

            Generate a Playwright test file.
            `;

    try {
      const result = await this.llm.generateText(systemPrompt, userPrompt);
      return result;
    } catch (err: any) {
      const msg = (err && err.message) ? err.message : String(err);
      console.error('[AI] Error generating Playwright test:', msg);
      // Return safe fallback skeleton
      return `
        import { test, expect } from '@playwright/test';

        test.describe('${request.featureDescription}', () => {
          test('should work as expected', async ({ page }) => {
            ${request.pageUrl ? `await page.goto('${request.pageUrl}');` : "// TODO: Navigate to page"}
            // TODO: Add test steps
            await expect(page).toBeTruthy();
          });
        });
        `;
    }
  }
}
