// src/ai/bugReportAssistant.ts
// Тут буде логіка для формування чернетки баг-репорту
// на основі інформації про падіння тесту.

interface FailedTestInfo {
  testName: string;
  errorMessage: string;
  stackTrace: string;
  screenshotPath?: string;
  videoPath?: string;
  url?: string;
  steps?: string[]; // Кроки, які призвели до падіння
}

interface BugReportDraft {
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
  async generateBugReportDraft(info: FailedTestInfo): Promise<BugReportDraft> {
    console.log(`[AI] Generating bug report draft for failed test: ${info.testName}`);
    // Тут буде виклик LLM API
    // Наразі повертаємо заглушку
    return {
      title: `[Bug] Failed test: ${info.testName}`,
      description: `Test failed with error: ${info.errorMessage}`,
      stepsToReproduce: info.steps || ['1. Go to URL', '2. Perform actions that led to failure'],
      expectedResult: 'Test should pass without errors.',
      actualResult: `Test failed with error: ${info.errorMessage}\nStack: ${info.stackTrace}`,
      severity: 'Medium',
      environment: 'Browser: Chromium, OS: Windows', // Це можна буде брати з Playwright context
      attachments: info.screenshotPath ? [info.screenshotPath] : [],
    };
  }
}
