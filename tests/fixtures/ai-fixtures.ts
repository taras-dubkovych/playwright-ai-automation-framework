import 'dotenv/config';
import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { BugReportAssistant, FailedTestInfo } from '../../src/ai/bugReportAssistant';
import { TestFixAssistant, FailedTestContext } from '../../src/ai/testFixAssistant';

type TestFixtures = {
  bugReportAssistant: BugReportAssistant;
  testFixAssistant: TestFixAssistant;
};

export const test = base.extend<TestFixtures>({
  bugReportAssistant: async ({}, use) => {
    const assistant = new BugReportAssistant();
    await use(assistant);
  },
  testFixAssistant: async ({}, use) => {
    const assistant = new TestFixAssistant();
    await use(assistant);
  },
});

export { expect };

const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts');
const BUG_REPORTS_FILE = path.join(ARTIFACTS_DIR, 'bug-reports.json');
const FIX_SUGGESTIONS_FILE = path.join(ARTIFACTS_DIR, 'fix-suggestions.json');

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

test.afterEach(async ({ page, bugReportAssistant, testFixAssistant }, testInfo) => {
  console.log(`\n[AI] afterEach called for test: ${testInfo.title}, status: ${testInfo.status}\n`);

  if (testInfo.status === 'failed') {
    const error = testInfo.error;
    const stackTrace = error?.stack ?? 'No stack trace available';
    const errorMessage = error?.message ?? 'Unknown error';
    const url = page.url();

    // 1. Генеруємо баг-репорт
    const failedInfo: FailedTestInfo = {
      testName: testInfo.title,
      errorMessage,
      stackTrace,
      url,
    };

    try {
      const bugDraft = await bugReportAssistant.generateBugReportDraft(failedInfo);

      let existingBugs: any[] = [];
      if (fs.existsSync(BUG_REPORTS_FILE)) {
        try {
          const content = fs.readFileSync(BUG_REPORTS_FILE, 'utf-8');
          existingBugs = JSON.parse(content);
        } catch {
          existingBugs = [];
        }
      }

      existingBugs.push({
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

      fs.writeFileSync(BUG_REPORTS_FILE, JSON.stringify(existingBugs, null, 2), 'utf-8');
      console.log(`[AI] Bug report draft saved to ${BUG_REPORTS_FILE}`);
    } catch (e) {
      console.error(`[AI] Failed to generate or save bug report for test '${testInfo.title}':`, e);
    }

    // 2. Генеруємо пропозицію фіксу
    const testFilePath = testInfo.file;
    let testCode = '';
    try {
      testCode = fs.readFileSync(testFilePath, 'utf-8');
    } catch {
      testCode = 'Unable to read test file';
    }

    const fixContext: FailedTestContext = {
      testName: testInfo.title,
      testFilePath,
      testCode,
      errorMessage,
      stackTrace,
      url,
    };

    try {
      const fixSuggestion = await testFixAssistant.suggestFix(fixContext);

      let existingFixes: any[] = [];
      if (fs.existsSync(FIX_SUGGESTIONS_FILE)) {
        try {
          const content = fs.readFileSync(FIX_SUGGESTIONS_FILE, 'utf-8');
          existingFixes = JSON.parse(content);
        } catch {
          existingFixes = [];
        }
      }

      existingFixes.push({
        testId: testInfo.testId,
        testName: testInfo.title,
        testFile: testFilePath,
        description: fixSuggestion.description,
        suggestedChanges: fixSuggestion.suggestedChanges,
        confidence: fixSuggestion.confidence,
        createdAt: new Date().toISOString(),
      });

      fs.writeFileSync(FIX_SUGGESTIONS_FILE, JSON.stringify(existingFixes, null, 2), 'utf-8');
      console.log(`[AI] Fix suggestion saved to ${FIX_SUGGESTIONS_FILE}\n`);
    } catch (e) {
      console.error(`[AI] Failed to generate or save fix suggestion for test '${testInfo.title}':`, e);
      console.error('[AI] Continuing without failing the test.\n');
    }
  }
});

