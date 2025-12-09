import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const FIX_SUGGESTIONS_FILE = path.join(process.cwd(), 'artifacts', 'fix-suggestions.json');

async function main() {
  if (!fs.existsSync(FIX_SUGGESTIONS_FILE)) {
    console.log('No fix suggestions found.');
    return;
  }

  const fixes = JSON.parse(fs.readFileSync(FIX_SUGGESTIONS_FILE, 'utf-8'));

  if (fixes.length === 0) {
    console.log('No fix suggestions available.');
    return;
  }

  console.log(`Found ${fixes.length} fix suggestion(s):\n`);

  for (let i = 0; i < fixes.length; i++) {
    const fix = fixes[i];
    console.log(`[${i + 1}] ${fix.testName}`);
    console.log(`    File: ${fix.testFile}`);
    console.log(`    Description: ${fix.description}`);
    console.log(`    Confidence: ${fix.confidence}`);
    console.log(`    Suggested changes:\n${fix.suggestedChanges}\n`);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter fix number to apply (or "skip" to exit): ', answer => {
    rl.close();

    if (answer.toLowerCase() === 'skip') {
      console.log('Skipped.');
      return;
    }

    const index = parseInt(answer, 10) - 1;
    if (index < 0 || index >= fixes.length) {
      console.log('Invalid number.');
      return;
    }

    const selectedFix = fixes[index];
    console.log(`\nApplying fix for: ${selectedFix.testName}`);
    console.log('⚠️  Manual application required — review the suggested changes above.');
    console.log('(Automatic patching can be added with a diff library like "diff" or "patch-package".)');
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
