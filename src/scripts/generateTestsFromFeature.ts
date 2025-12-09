import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { TestGenerator } from '../ai/testGenerator';

async function main() {
  const featureDescription = `
            As a standard user, I want to log in to the application
            so that I can see the list of products and add items to my cart.

            Acceptance criteria:
            - User can log in with valid credentials
            - User sees "Products" page after login
            - User can add product to cart
            - Cart badge shows correct item count
            `;

  const request = {
    featureDescription,
    pageUrl: 'https://www.saucedemo.com/',
    pageElements: [
      '#user-name',
      '#password',
      '#login-button',
      '.inventory_item',
      '.shopping_cart_badge',
    ],
  };

  const generator = new TestGenerator();

  console.log('=== Generated test cases ===\n');
  const cases = await generator.generateTestCases(request);
  console.log(cases.join('\n'));

  console.log('\n=== Generated Playwright test skeleton ===\n');
  let testCode = await generator.generatePlaywrightTest(request);
  console.log(testCode);

  // --- Extract and save PO classes ---
  // Match all exported classes named <Name>Page
  const poClassRegex = /export class (\w+Page)\s*\{[\s\S]*?^\}/gm;
  let match;
  let poClasses = [];
  while ((match = poClassRegex.exec(testCode)) !== null) {
    const className = match[1];
    const classCode = match[0];
    const poPath = path.join(process.cwd(), 'src', 'pages', `${className}.ts`);
    fs.writeFileSync(poPath, classCode + '\n', 'utf-8');
    console.log(`✅ PO class saved to: ${poPath}`);
    poClasses.push({ className, poPath });
  }
  // Remove PO classes from test code
  testCode = testCode.replace(poClassRegex, '').trim();

  // Додаємо потрібні імпорти для згенерованого тесту
  const header = `import { test, expect } from './fixtures/ai-fixtures';`;
  const finalTestCode = `${header}\n\n${testCode}`;

  // Зберігаємо згенерований тест у файл
  const outputPath = path.join(process.cwd(), 'tests', 'generated.spec.ts');
  fs.writeFileSync(outputPath, finalTestCode, 'utf-8');
  console.log(`\n✅ Test saved to: ${outputPath}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

