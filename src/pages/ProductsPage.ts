import { BasePage } from './BasePage';
import type { Page } from '@playwright/test';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get pageTitle() {
    return this.page.locator('.title');
  }

  async isLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
    return (await this.pageTitle.textContent()) === 'Products';
  }
}
