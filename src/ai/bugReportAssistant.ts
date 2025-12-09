// src/ai/bugReportAssistant.ts

export interface FailedTestInfo {
  testName: string;
  errorMessage: string;
  stackTrace: string;
  screenshotPath?: string;
  videoPath?: string;
  url?: string;
  steps?: string[]; // manual steps, optional
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
  async generateBugReportDraft(info: FailedTestInfo): Promise<BugReportDraft> {
    // Пізніше тут буде виклик LLM API, поки — розумна заглушка
    return {
      title: `[Bug] Failed test: ${info.testName}`,
      description: `Automated test "${info.testName}" failed.\n\nError: ${info.errorMessage}`,
      stepsToReproduce:
        info.steps ?? ['1. Run automated test', '2. Observe failure details in logs / trace.'],
      expectedResult: 'Test scenario should complete without errors.',
      actualResult: `Test failed with error: ${info.errorMessage}\nStack: ${info.stackTrace}`,
      severity: 'Medium',
      environment: 'Browser: Chromium/Firefox (Playwright), OS: Windows',
      attachments: [info.screenshotPath, info.videoPath].filter(
        (x): x is string => Boolean(x),
      ),
    };
  }
}
