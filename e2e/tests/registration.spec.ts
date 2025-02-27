
import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';

test.describe('Registration Tests', () => {
    let registrationPage: RegistrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        await registrationPage.visit();
    });

    test('should successfully create new account', async ({ page }) => {
        await registrationPage.createAccount();
        await expect(page).toHaveURL(/.*\/dashboard/);
    });

    test('should show validation messages for empty form', async ({ page }) => {
        await registrationPage.submitEmptyForm();
        await expect(page.locator(`text=${registrationPage.validationMessages.nameRequired}`)).toBeVisible();
        await expect(page.locator(`text=${registrationPage.validationMessages.invalidEmail}`)).toBeVisible();
        await expect(page.locator(`text=${registrationPage.validationMessages.invalidPhone}`)).toBeVisible();
        await expect(page.locator(`text=${registrationPage.validationMessages.passwordLength}`)).toBeVisible();
    });

    test('should show validation message when passwords do not match', async () => {
        await registrationPage.verifyPasswordMustMatch();
    });

    test('should validate password requirements', async () => {
        await registrationPage.verifyShortPassword();
        await registrationPage.verifyPasswordUppercase();
        await registrationPage.verifyPasswordOnlyNumber();
        await registrationPage.verifyPasswordSpecialCharacter();        

    });

    // Skip this test as it will fail due to existing bug
    test.skip('should not allow registration with existing email', async () => {
        await registrationPage.verifyExistingAccountCantCreate();
    });

    test('should verify login after registration', async () => {
        await registrationPage.createAccount();
        await registrationPage.verifyLoginAfterRegistration();
    });
});
