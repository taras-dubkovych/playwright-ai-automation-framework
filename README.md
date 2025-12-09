## Playwright AI Automation Framework

A **TypeScript** + **Playwright** UI test automation framework with:
- **Page Object Model (POM)** architecture for maintainable tests
- **OOP-based** services and utilities
- **Logger** for debugging
- **Playwright** browser automation (Chromium, Firefox)
- **AI-powered** bug report generation using OpenAI GPT-4o-mini
- **GitHub Actions CI/CD** pipeline

---

## 🎯 Key Features

### 🤖 AI Integration
- **Auto-generated bug reports** from failed test runs using OpenAI LLM
- **AI fixtures** that capture failed test info and generate structured bug reports
- **Smart JSON parsing** with fallback to mock data
- Bug reports saved to `artifacts/bug-reports.json`

### 🏗️ Architecture
- **Page Object Model** for cleaner, maintainable tests
- **Service-based** business logic layer
- **Modular structure** with separated concerns (pages, services, models, AI)

### 🚀 CI/CD
- **GitHub Actions** workflow on push/PR
- **Automated test execution** with Chromium & Firefox
- **Artifact uploads** for reports, screenshots, videos, and AI bug reports

---

## 📋 Project Structure

```
playwright-ai-automation-framework/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions workflow
├── src/
│   ├── ai/
│   │   ├── bugReportAssistant.ts     # AI bug report generator (+ LLM integration)
│   │   ├── llmClient.ts              # OpenAI client wrapper
│   │   └── testGenerator.ts          # Test case generator (scaffold)
│   ├── core/
│   │   ├── BaseService.ts            # Base class for services
│   │   ├── Logger.ts                 # Logger utility
│   │   └── UserService.ts            # Example service
│   ├── models/
│   │   └── User.ts                   # User domain model
│   ├── pages/
│   │   ├── BasePage.ts               # Base page object
│   │   ├── HomePage.ts               # Home page POM
│   │   ├── LoginPage.ts              # SauceDemo login page POM
│   │   └── ProductsPage.ts           # SauceDemo products page POM
│   ├── utils/
│   │   └── mathUtils.ts              # Utility functions (generics example)
│   ├── index.ts                      # Main entry point
│   └── test.ts                       # Simple TS test file
├── tests/
│   ├── example.spec.ts               # Example test (Playwright.dev)
│   ├── login.spec.ts                 # SauceDemo login tests (with AI fixtures)
│   └── fixtures/
│       └── ai-fixtures.ts            # Custom test fixtures + AI hook
├── artifacts/
│   └── bug-reports.json              # Generated AI bug reports (auto-created)
├── .env                              # Environment config (local only)
├── .gitignore                        # Git ignore rules
├── playwright.config.ts              # Playwright configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies & scripts
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (check: `node --version`)
- **npm** 8+ (check: `npm --version`)
- **OpenAI API Key** (for AI features) — get at [platform.openai.com](https://platform.openai.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/taras-dubkovych/playwright-ai-automation-framework.git
cd playwright-ai-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Set your OpenAI API key
# Edit .env and add your key:
# OPENAI_API_KEY=sk-your-key-here
```

---

## 🔑 Environment Setup

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**⚠️ Never commit `.env` to git** — it's already in `.gitignore`.

---

## 📚 Available Commands

### Run Tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests for a specific file
npx playwright test tests/login.spec.ts

# Run tests with a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Run tests in debug mode
npx playwright test --debug

# Run tests with UI mode (interactive)
npx playwright test --ui
```

### View Reports

```bash
# Open HTML report from last test run
npx playwright show-report

# View AI-generated bug reports (JSON)
cat artifacts/bug-reports.json
```

### Development

```bash
# Compile TypeScript
npx tsc

# Run TypeScript file directly
npx ts-node src/index.ts

# Run simple test file
npx ts-node src/test.ts
```

---

## 🏗️ Architecture

### Page Object Model (POM)

Tests use the **Page Object Model** pattern for cleaner, maintainable code:

**Example:**
```typescript
// src/pages/LoginPage.ts
export class LoginPage extends BasePage {
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// tests/login.spec.ts
import { test } from './fixtures/ai-fixtures';
const loginPage = new LoginPage(page);
await loginPage.login('user', 'pass');
```

### Services & Models

**OOP architecture** for business logic:
- `UserService` — manages users
- `User` — domain model
- `Logger` — contextual logging
- `BaseService` — base class for all services

**Example:**
```typescript
const userService = new UserService();
const user = userService.createUser('test@example.com', 'QA Engineer', ['ADMIN']);
```

### AI Integration

**Auto-generate bug reports from failed tests:**

```typescript
import { test, expect } from './fixtures/ai-fixtures';

test('my test', async ({ page, bugReportAssistant }) => {
  // Your test code...
  // If test fails, AI fixture auto-generates a bug report
  // Report saved to artifacts/bug-reports.json
});
```

**How it works:**
1. Test fails
2. `ai-fixtures.ts` catches the failure in `afterEach` hook
3. `BugReportAssistant` calls `LlmClient` (OpenAI API)
4. LLM generates structured bug report (title, description, severity, steps)
5. Report saved to `artifacts/bug-reports.json` with timestamp

---

## 🧪 Test Examples

### SauceDemo Login Tests

**File:** `tests/login.spec.ts`

```typescript
import { test, expect } from './fixtures/ai-fixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';

test.describe('Login functionality', () => {
  test('should allow a standard user to login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(productsPage.pageTitle).toBeVisible();
  });

  test('should show error for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
  });
});
```

---

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)
- **Base URL**: https://www.saucedemo.com/ (SauceDemo)
- **Timeout**: 30 seconds per test
- **Retries**: 0 locally, 2 in CI
- **Parallel**: Enabled
- **Browsers**: Chromium, Firefox
- **Reporter**: List + HTML
- **Screenshot**: On failure
- **Video**: On failure
- **Trace**: On first retry

### TypeScript Config (`tsconfig.json`)
- **Target**: ES2020
- **Module**: ESNext
- **Strict mode**: Enabled
- **Source maps**: Enabled
- **Declaration files**: Enabled

### OpenAI Config (`.env`)
```
OPENAI_API_KEY=sk-your-key-here
```

---

## 📝 How to Write Tests

1. **Create a Page Object** in `src/pages/`:
   ```typescript
   export class MyPage extends BasePage {
     async openPage() { await this.goto('/my-page'); }
     async clickButton() { await this.page.locator('button').click(); }
   }
   ```

2. **Create a Test** in `tests/` using AI fixtures:
   ```typescript
   import { test, expect } from './fixtures/ai-fixtures';
   import { MyPage } from '../src/pages/MyPage';

   test('my test', async ({ page }) => {
     const myPage = new MyPage(page);
     await myPage.openPage();
     // If fails, AI auto-generates bug report
   });
   ```

---

## 🚦 CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

Automatically:
- ✅ Runs on every push & PR to `main`/`master`
- ✅ Installs Node.js 20 + dependencies
- ✅ Installs Playwright browsers
- ✅ Runs tests with `CI=true` env var
- ✅ Uploads Playwright HTML report
- ✅ Uploads AI bug reports (if any)

**View artifacts:**
1. Go to GitHub Actions → Latest workflow run
2. Download `playwright-report` or `ai-bug-reports`

---

## 🤖 AI Features (Powered by OpenAI)

### BugReportAssistant

Generates structured bug reports from failed test runs:

```typescript
const assistant = new BugReportAssistant();
const bugDraft = await assistant.generateBugReportDraft({
  testName: 'Login test',
  errorMessage: 'Login button not found',
  stackTrace: '...',
  url: 'https://www.saucedemo.com/',
});

// Result:
{
  title: '[Bug] Login button not responding',
  description: 'User unable to click login button...',
  stepsToReproduce: ['1. Navigate to login page', ...],
  expectedResult: 'Login should succeed',
  actualResult: 'Button not clickable',
  severity: 'High',
  environment: 'Browser: Chromium/Firefox, OS: Windows'
}
```

### LlmClient

Wrapper around OpenAI API for easy LLM calls:

```typescript
const llm = new LlmClient(process.env.OPENAI_API_KEY);
const response = await llm.generateText(
  'You are a QA expert...',
  'Generate test cases for login flow'
);
```

### TestGenerator (Scaffold)

Placeholder for future AI test generation:
```typescript
const generator = new TestGenerator();
const testCases = await generator.generateTestCases('Login functionality');
```

---

## 📦 Dependencies

### Main
- `@playwright/test` — Playwright test framework
- `openai` — OpenAI API client

### Dev
- `typescript` — TypeScript compiler
- `ts-node` — Run TypeScript directly

Check `package.json` for all dependencies and versions.

---

## 🔮 Upcoming Features

- [ ] TestGenerator: AI-powered test case generation from feature descriptions
- [ ] API client service (for backend testing)
- [ ] Database fixtures & seeding
- [ ] Test data management
- [ ] Performance metrics collection
- [ ] Slack integration for bug reports
- [ ] Jira ticket auto-creation from bug reports
- [ ] Advanced trace analysis

---

## 🐛 Troubleshooting

### OpenAI API Key not working
- Verify key is in `.env`: `OPENAI_API_KEY=sk-...`
- Check key has API access at [platform.openai.com](https://platform.openai.com)
- Ensure key is not expired or has sufficient credits

### Tests timeout
- Increase timeout in `playwright.config.ts` → `timeout`
- Check internet connection for SauceDemo access
- Run with `--headed` to see what's happening

### AI bug reports not generating
- Ensure `.env` has valid OpenAI API key
- Check network connectivity
- Check OpenAI API status at [status.openai.com](https://status.openai.com)

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Framework](https://playwright.dev/docs/intro)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [SauceDemo Testing Sandbox](https://www.saucedemo.com/)

---

## 📄 License

MIT

---

## 👤 Author

**taras-dubkovych** — GitHub

---

**Happy Testing! 🎭✨**
