import { LlmClient } from './llmClient';

export interface FailedTestInfo {
  testName: string;
  errorMessage: string;
  stackTrace: string;
  screenshotPath?: string;
  videoPath?: string;
  url?: string;
  steps?: string[];
}

export interface BugReportDraft {
  title: string;
  description: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  environment: string;
  attachments?: string[];
}

export class BugReportAssistant {
  private llm: LlmClient;

  constructor(llmClient?: LlmClient) {
    this.llm = llmClient ?? new LlmClient();
  }

  async generateBugReportDraft(info: FailedTestInfo): Promise<BugReportDraft> {
    const systemPrompt = `
        You are a QA engineer helping to write clear, concise bug reports
        based on automated test failures.
        Always respond with JSON using the keys:
        title, description, stepsToReproduce, expectedResult, actualResult, severity.
        Severity is one of: Low, Medium, High, Critical.
        Ensure the title starts with "[Agent]".
        `;

    const userPrompt = `
        Automated test failed.

        Test name: ${info.testName}
        URL: ${info.url ?? 'unknown'}
        Error message: ${info.errorMessage}
        Stack trace:
        ${info.stackTrace}

        Generate a bug report draft.
        `;

    const raw = await this.llm.generateText(systemPrompt, userPrompt);

    let parsed: any;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : raw;
      parsed = JSON.parse(jsonString);
    } catch {
      // fallback – якщо JSON не розпарсили
      parsed = {
        title: `[Agent] Failed test: ${info.testName}`, // <-- Змінено тут
        description: raw,
        stepsToReproduce: info.steps ?? [],
        expectedResult: 'Test scenario should complete without errors.',
        actualResult: info.errorMessage,
        severity: 'Medium',
      };
    }

    const draft: BugReportDraft = {
      title: parsed.title?.startsWith('[Agent]') // <-- Перевіряємо, чи LLM вже додав префікс
        ? parsed.title
        : `[Agent] ${parsed.title ?? `Failed test: ${info.testName}`}`, // <-- Додаємо, якщо немає
      description:
        `Generated automatically by AI bug report assistant from Playwright test results.\n\n` + // <-- Додаємо цей рядок
        (parsed.description ?? ''),
      stepsToReproduce: parsed.stepsToReproduce ?? [],
      expectedResult: parsed.expectedResult ?? 'Test scenario should complete without errors.',
      actualResult: parsed.actualResult ?? info.errorMessage,
      severity: parsed.severity ?? 'Medium',
      environment: 'Browser: Chromium/Firefox (Playwright), OS: Windows',
      attachments: [info.screenshotPath, info.videoPath].filter(
        (x): x is string => Boolean(x),
      ),
    };

    return draft;
  }
}
