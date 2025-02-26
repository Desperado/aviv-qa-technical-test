
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Invalid Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.visit();
    });

    test('should show error with invalid credentials', async () => {
        await loginPage.loginWithInvalidCredentials();
    });

    test('should show error with empty form submission', async () => {
        await loginPage.submitEmptyForm();
    });

    test('should show error when only email is entered', async () => {
        await loginPage.loginWithEmptyPassword();
    });

    test('should show error when only password is entered', async () => {
        await loginPage.loginWithEmptyEmail();
    });

    test('should display error message with invalid password', async () => {
        await loginPage.loginWithWrongPassword();
    });

    test('should display error message with non-existent user', async () => {
        await loginPage.loginWithNonExistentUser();
    });

});
