import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.visit();
    });

    test('should login successfully with valid user credentials', async ({ page }) => {
        // Setup
        await loginPage.loginAsUser();
        // Validate
        await expect(page).toHaveURL(/.*\/dashboard/);
        await loginPage.verifyLoggedInUser('user');
    });

    test('should login successfully with valid agent credentials', async ({ page }) => {
        // Setup
        await loginPage.loginAsAgent();
        // Validate
        await expect(page).toHaveURL(/.*\/dashboard/);
        await loginPage.verifyLoggedInUser('agent');
    });

    test('should login successfully with valid admin credentials', async ({ page }) => {
        // Setup
        await loginPage.loginAsAdmin();
        // Validate
        await expect(page).toHaveURL(/.*\/dashboard/);
        await loginPage.verifyLoggedInUser('admin');
    });
});
