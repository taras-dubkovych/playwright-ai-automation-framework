import { BasePage } from './BasePage';
import type { Page } from '@playwright/test';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get startedLink() {
    return this.page.getByRole('link', { name: 'Get started' });
  }

  async open() {
    await this.goto('/');
  }

  async clickGetStarted() {
    await this.startedLink.click();
  }
}
