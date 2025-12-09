import 'dotenv/config';
import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { BugReportAssistant, FailedTestInfo } from '../../src/ai/bugReportAssistant';

type TestFixtures = {
  bugReportAssistant: BugReportAssistant;
};

export const test = base.extend<TestFixtures>({
  bugReportAssistant: async ({}, use) => {
    const assistant = new BugReportAssistant();
    await use(assistant);
  },
});

export { expect };

// Папка для артефактів AI-багрепортів
const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts');
const BUG_REPORTS_FILE = path.join(ARTIFACTS_DIR, 'bug-reports.json');

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

// Глобальний afterEach для цього тест-раннера
test.afterEach(async ({ page, bugReportAssistant }, testInfo) => {
  console.log(`\n[AI] afterEach called for test: ${testInfo.title}, status: ${testInfo.status}\n`);
  if (testInfo.status === 'failed') {
    const error = testInfo.error;
    const stackTrace = error?.stack ?? 'No stack trace available';
    const errorMessage = error?.message ?? 'Unknown error';

    // Забираємо останній відомий URL
    const url = page.url();

    const failedInfo: FailedTestInfo = {
      testName: testInfo.title,
      errorMessage,
      stackTrace,
      url,
      // Тут можна додати кроки, якщо ти їх зберігаєш десь
    };

    try {
      const bugDraft = await bugReportAssistant.generateBugReportDraft(failedInfo);

      // Зберігаємо в JSON (масивом)
      let existing: any[] = [];
      if (fs.existsSync(BUG_REPORTS_FILE)) {
        try {
          const content = fs.readFileSync(BUG_REPORTS_FILE, 'utf-8');
          existing = JSON.parse(content);
        } catch {
          existing = [];
        }
      }

      existing.push({
        testId: testInfo.testId,
        title: bugDraft.title,
        description: bugDraft.description,
        stepsToReproduce: bugDraft.stepsToReproduce,
        expectedResult: bugDraft.expectedResult,
        actualResult: bugDraft.actualResult,
        severity: bugDraft.severity,
        environment: bugDraft.environment,
        url: failedInfo.url,
        createdAt: new Date().toISOString(),
      });

      fs.writeFileSync(BUG_REPORTS_FILE, JSON.stringify(existing, null, 2), 'utf-8');

      console.log(`\n[AI] Bug report draft saved to ${BUG_REPORTS_FILE}\n`);
    } catch (e) {
      // Log the error but don't let it fail the test run
      console.error(`\n[AI] Failed to generate or save bug report for test '${testInfo.title}':`, e);
      console.error('[AI] Continuing without failing the test.');
    }
  }
});
