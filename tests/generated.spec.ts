
import { test, expect } from './fixtures/ai-fixtures';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';

test.describe('User Login and Product Management', () => {
    let loginPage: LoginPage;
    let productsPage: ProductsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        await loginPage.goto();
    });

    test('User can log in with valid credentials', async () => {
        await loginPage.fillCredentials('standard_user', 'secret_sauce');
        await loginPage.submit();
        await productsPage.verifyProductsPage();
    });

    test('User can add product to cart', async () => {
        await loginPage.fillCredentials('standard_user', 'secret_sauce');
        await loginPage.submit();
        await productsPage.verifyProductsPage();
        
        await productsPage.addProductToCart();
        const cartCount = await productsPage.getCartBadgeCount();
        expect(cartCount).toBe('1');
    });
});
