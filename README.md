## Playwright AI Automation Framework

A **TypeScript** + **Playwright** UI test automation framework with:
- **Page Object Model (POM)** architecture for maintainable tests
- **OOP-based** services and utilities
- **Logger** for debugging
- **Playwright** browser automation (Chromium, Firefox)
- Ready for **AI assistant** integration (test generator, bug report generator)

---

## 📋 Project Structure

```
playwright-ai-automation-framework/
├── src/
│   ├── core/
│   │   ├── BaseService.ts       # Base class for services
│   │   ├── Logger.ts            # Logger utility
│   │   └── UserService.ts       # Example service (User management)
│   ├── models/
│   │   └── User.ts              # User model/domain entity
│   ├── pages/
│   │   ├── BasePage.ts          # Base page object
│   │   └── HomePage.ts          # Home page object
│   ├── utils/
│   │   └── mathUtils.ts         # Utility functions (generics example)
│   ├── index.ts                 # Main entry point
│   └── test.ts                  # Simple TS test file
├── tests/
│   └── example.spec.ts          # Playwright test example (using POM)
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (check: `node --version`)
- **npm** 8+ (check: `npm --version`)

### Installation

```bash
# Clone the repository
git clone https://github.com/taras-dubkovych/playwright-ai-automation-framework.git
cd playwright-ai-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## 📚 Available Commands

### Run Tests
```bash
# Run all tests
npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests for a specific file
npx playwright test tests/example.spec.ts

# Run tests with a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Run tests in debug mode
npx playwright test --debug

# Run tests with UI mode (interactive)
npx playwright test --ui
```

### View Test Reports
```bash
# Open HTML report from last test run
npx playwright show-report
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
Tests use the **Page Object Model** pattern for cleaner, more maintainable code:

**Example:**
```typescript
// src/pages/HomePage.ts
export class HomePage extends BasePage {
  async open() {
    await this.goto('/');
  }

  async clickGetStarted() {
    await this.startedLink.click();
  }
}

// tests/example.spec.ts
const homePage = new HomePage(page);
await homePage.open();
await homePage.clickGetStarted();
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

---

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)
- **Timeout**: 30 seconds per test
- **Retries**: 0 locally, 2 in CI
- **Parallel**: Enabled
- **Browsers**: Chromium, Firefox
- **Base URL**: https://playwright.dev
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

---

## 🧪 Example Test

**File:** `tests/example.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';

test('homepage via POM: title and get started link', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();
  await expect(page).toHaveTitle(/Playwright/);
  await expect(homePage.startedLink).toBeVisible();

  await homePage.clickGetStarted();
  await expect(page).toHaveURL(/.*docs/);
});
```

---

## 📝 How to Write Tests

1. **Create a Page Object** in `src/pages/`:
   ```typescript
   export class MyPage extends BasePage {
     async openPage() { await this.goto('/my-page'); }
     // Add methods for interactions...
   }
   ```

2. **Create a Test** in `tests/`:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { MyPage } from '../src/pages/MyPage';

   test('my test', async ({ page }) => {
     const myPage = new MyPage(page);
     await myPage.openPage();
     // Add assertions...
   });
   ```

---

## 🚦 CI/CD Integration

**GitHub Actions** (upcoming):
- Automatically run tests on push/PR
- Generate HTML reports
- Run tests in parallel with 2 workers
- Retries enabled (2)

---

## 📦 Dependencies

### Main
- `@playwright/test` — Playwright test framework

### Dev
- `typescript` — TypeScript compiler
- `ts-node` — Run TypeScript directly

Check `package.json` for all dependencies.

---

## 🔮 Upcoming Features

- [ ] AI test case generator (from feature descriptions)
- [ ] AI bug report generator (from failed test runs)
- [ ] GitHub Actions CI pipeline
- [ ] API client service (for backend testing)
- [ ] Database fixtures & seeding
- [ ] Test data management
- [ ] Performance metrics collection

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Framework](https://playwright.dev/docs/intro)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📄 License

MIT

---

## 👤 Author

**taras-dubkovych** — GitHub

---

**Happy Testing! 🎭**
