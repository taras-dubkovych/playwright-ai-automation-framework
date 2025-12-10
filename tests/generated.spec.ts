

import { test, expect } from './fixtures/ai-fixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';

test.describe('User Login and Product Management', () => {
    let loginPage: LoginPage;
    let productsPage: ProductsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        await loginPage.open();
    });

    test('User can log in with valid credentials', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        expect(await productsPage.isLoaded()).toBe(true);
    });

    // Uncomment and implement these methods in ProductsPage if needed
    // test('User can add product to cart', async () => {
    //   await loginPage.login('standard_user', 'secret_sauce');
    //   expect(await productsPage.isLoaded()).toBe(true);
    //   await productsPage.addProductToCart();
    //   const cartCount = await productsPage.getCartBadgeCount();
    //   expect(cartCount).toBe('1');
    // });
});
