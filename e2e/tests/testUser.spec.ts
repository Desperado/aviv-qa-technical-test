import { test, expect } from '@playwright/test';
import { TestUserPage } from '../pages/TestUserPage';
import { LoginPage } from '../pages/loginPage';

test.describe('Test User Dashboard Tests', () => {
    let testUserPage: TestUserPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        // Align
        loginPage = new LoginPage(page);
        await loginPage.visit();

        // Setup
        await loginPage.loginAsUser();

        // Validate
        await expect(page).toHaveURL(/.*\/dashboard/);
        await loginPage.verifyLoggedInUser('user');

        testUserPage = new TestUserPage(page);
    });

    test('should display dashboard correctly for user role', async () => {
        // Setup & Validate
        await testUserPage.verifyDashboard();
    });

    test('should navigate through menu items successfully', async () => {
        // Setup & Validate
        await testUserPage.navigateAndVerifyMenu();
    });

    test('should perform complete user workflow', async () => {
        // Align - User is already logged in from beforeEach
        
        // Setup & Validate
        await testUserPage.verifyDashboard();
        await testUserPage.navigateAndVerifyMenu();
        await testUserPage.verifyContentGrid();
    });

    test('should update profile settings, logout and verify new credentials', async () => {
        // Setup & Validate
        await testUserPage.updateProfileAndVerify();
    });
});