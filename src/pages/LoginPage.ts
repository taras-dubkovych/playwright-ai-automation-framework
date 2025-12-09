import { BasePage } from './BasePage';
import type { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get usernameInput() {
    return this.page.locator('[data-test="username"]');
  }

  get passwordInput() {
    return this.page.locator('[data-test="password"]');
  }

  get loginButton() {
    return this.page.locator('[data-test="login-button"]');
  }

  get errorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  async open() {
    await this.goto('/'); // Відкриваємо сторінку логіну
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
