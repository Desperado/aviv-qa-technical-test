import { Page, Locator, expect } from '@playwright/test';
import testData from '../data/testData.json' assert { type: 'json' };

export class LoginPage {
    readonly page: Page;
    readonly signUpButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly signUpLink: Locator;
    readonly userProfileButton: Locator;
    readonly toastError: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signUpButton = page.locator('.text-gray-500 > .text-blue-600');
        this.emailInput = page.locator(':nth-child(2) > .w-full');
        this.passwordInput = page.locator(':nth-child(3) > .w-full');
        this.signInButton = page.locator('.space-y-6 > .inline-flex');
        this.signUpLink = page.locator('.text-gray-500 > .text-blue-600');
        this.userProfileButton = page.locator('.flex > .h-8');
        this.toastError = page.locator('.p-3');
        this.logoutButton = page.locator('.absolute > .w-full');
    }

    async visit() {
        await this.page.goto('/login');
    }

    async clickSignUp() {
        await this.signUpButton.click();
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async loginAsUser() {
        await this.login(testData.users.user.email, testData.users.user.password);
    }

    async loginAsAgent() {
        await this.login(testData.users.agent.email, testData.users.agent.password);
    }

    async loginAsAdmin() {
        await this.login(testData.users.admin.email, testData.users.admin.password);
    }

    async loginWithInvalidCredentials() {
        await this.login(testData.invalidCredentials.email, testData.invalidCredentials.password);
        await expect(this.toastError).toContainText('Invalid email or password');
    }

    async submitEmptyForm() {
        await this.signInButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]').first()).toBeVisible();
    }

    async loginWithEmptyPassword() {
        await this.emailInput.fill(testData.users.user.email);
        await this.signInButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]')).toBeVisible();
    }

    async loginWithEmptyEmail() {
        await this.passwordInput.fill(testData.users.user.password);
        await this.signInButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]')).toBeVisible();
    }

    async loginWithWrongPassword() {
        await this.login(testData.users.user.email, 'wrongpassword');
        await expect(this.toastError).toContainText('Invalid email or password');
    }

    async loginWithNonExistentUser() {
        await this.login('nonexistent@example.com', testData.users.user.password);
        await expect(this.toastError).toContainText('Invalid email or password');
    }

    async verifyLoggedInUser(role: 'user' | 'agent' | 'admin') {
        const userEmails = {
            user: testData.users.user.email,
            agent: testData.users.agent.email,
            admin: testData.users.admin.email
        };

        await expect(this.page).toHaveURL(/.*\/dashboard/);
        await this.userProfileButton.click();
        await expect(this.page.getByText(userEmails[role])).toBeVisible();
    }

    async logout() {
        await this.userProfileButton.click();
        await this.logoutButton.click();
        await expect(this.page).toHaveURL(/.*\/login/);
    }

    async verifyValidationMessage(message: string) {
        await expect(this.toastError).toContainText(message);
    }
}
