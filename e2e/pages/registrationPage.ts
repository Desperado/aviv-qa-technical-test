
import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
    readonly page: Page;
    readonly fullNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly accountTypeDropdown: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly createAccountButton: Locator;
    readonly userProfileButton: Locator;
    readonly logoutButton: Locator;

    readonly validationMessages = {
        nameRequired: 'Name must be at least 2 characters',
        invalidEmail: 'Invalid email address',
        invalidPhone: 'Please enter a valid phone number',
        passwordLength: 'Password must be at least 8 characters',
        passwordsDoNotMatch: "Passwords don't match",
        passwordUppercase: 'Password must contain at least one uppercase letter',
        passwordNumber: 'Password must contain at least one number',
        passwordSpecial: 'Password must contain at least one special character'
    };

    readonly testUserData = {
        fullName: 'Test User',
        email: `test${Date.now()}@example.com`,
        phone: '1234567890',
        accountType: 'user',
        password: 'Test123!'
    };

    readonly existingUserData = {
        fullName: 'Existing User',
        email: 'test@example.com',
        phone: '1234567890',
        accountType: 'user',
        password: 'Test123!'
    };

    readonly weakPasswordData = {
        fullName: 'Test User',
        email: 'newuser@example.com',
        phone: '1234567890',
        accountType: 'user',
        password: 'weak'
    };

    readonly nonUppercasePasswordData = {
        fullName: 'Test User',
        email: 'newuser@example.com',
        phone: '1234567890',
        accountType: 'user',
        password: 'weakweak'
    };

    readonly onlyNumberPasswordData = {
        fullName: 'Test User',
        email: 'newuser@example.com',
        phone: '1234567890',
        accountType: 'user',
        password: '12345678'
    };

    readonly invalidTestData = {
        shortName: 'A',
        invalidEmail: 'invalid.email',
        invalidPhone: 'abc123',
        shortPassword: 'weak',
        noUppercasePassword: 'weakweak',
        noNumberPassword: 'WeakWeak',
        noSpecialCharacterPassword:
            'WeakWeak123',
        differentConfirmPassword: 'Different123!'
    };

    constructor(page: Page) {
        this.page = page;
        this.fullNameInput = page.locator('.space-y-6 > :nth-child(1) > .w-full');
        this.emailInput = page.locator(':nth-child(2) > .w-full');
        this.phoneInput = page.locator(':nth-child(3) > .w-full');
        this.accountTypeDropdown = page.locator(':nth-child(4) > .w-full');
        this.passwordInput = page.locator(':nth-child(5) > .w-full');
        this.confirmPasswordInput = page.locator(':nth-child(6) > .w-full');
        this.createAccountButton = page.locator('.space-y-6 > .inline-flex');
        this.userProfileButton = page.locator('.flex > .h-8');
        this.logoutButton = page.locator('.absolute > .w-full');
    }

    async visit() {
        await this.page.goto('/register');
    }

    async createAccount(userData = this.testUserData) {
        await this.fullNameInput.fill(userData.fullName);
        await this.emailInput.fill(userData.email);
        await this.phoneInput.fill(userData.phone);
        await this.accountTypeDropdown.selectOption(userData.accountType);
        await this.passwordInput.fill(userData.password);
        await this.confirmPasswordInput.fill(userData.password);
        await this.createAccountButton.click();
    }

    async submitEmptyForm() {
        await this.createAccountButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]').first()).toBeVisible();
    }

    async verifyPasswordMustMatch() {
        await this.fillBasicInfo();
        await this.passwordInput.fill(this.testUserData.password);
        await this.confirmPasswordInput.fill(this.invalidTestData.differentConfirmPassword);
        await this.createAccountButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]'))
            .toHaveText(this.validationMessages.passwordsDoNotMatch);
    }

    async verifyPasswordValidation(passwordData: { password: string }, expectedMessage: string) {
        await this.fillBasicInfo();
        await this.passwordInput.fill(passwordData.password);
        await this.confirmPasswordInput.fill(passwordData.password);
        await this.createAccountButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]'))
            .toHaveText(expectedMessage);
    }

    async verifyShortPassword() {
        await this.verifyPasswordValidation({ password: this.invalidTestData.shortPassword }, this.validationMessages.passwordLength);
    }

    async verifyPasswordUppercase() {
        await this.verifyPasswordValidation({ password: this.invalidTestData.noUppercasePassword }, this.validationMessages.passwordUppercase);
    }

    async verifyPasswordOnlyNumber() {
        await this.verifyPasswordValidation({ password: this.invalidTestData.noNumberPassword }, this.validationMessages.passwordNumber);
    }

    async verifyPasswordSpecialCharacter() {
        await this.verifyPasswordValidation({ password: this.invalidTestData.noSpecialCharacterPassword }, this.validationMessages.passwordSpecial);
    }

        

    async verifyExistingAccountCantCreate() {
        await this.createAccount(this.existingUserData);
        await expect(this.page.locator('.p-3')).toContainText('Email already exists');
    }

    async verifyLoginAfterRegistration() {
        await expect(this.page).toHaveURL(/.*\/dashboard/);
        await this.userProfileButton.click();
        await expect(this.page.getByText(this.testUserData.email)).toBeVisible();
    }

    private async fillBasicInfo() {
        await this.fullNameInput.fill(this.testUserData.fullName);
        await this.emailInput.fill(this.testUserData.email);
        await this.phoneInput.fill(this.testUserData.phone);
        await this.accountTypeDropdown.selectOption(this.testUserData.accountType);
    }
}
