
import { Page, Locator, expect } from '@playwright/test';

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
        await this.login('test@example.com', 'Test123!');
    }

    async loginAsAgent() {
        await this.login('agent@example.com', 'Test123!');
    }

    async loginAsAdmin() {
        await this.login('admin@example.com', 'Test123!');
    }

    async loginWithInvalidCredentials() {
        await this.login('invalid@example.com', 'wrongpassword');
        await expect(this.toastError).toContainText('Invalid email or password');
    }

    async submitEmptyForm() {
        await this.signInButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]').first()).toBeVisible();
    }

    async loginWithEmptyPassword() {
        await this.emailInput.fill('test@example.com');
        await this.signInButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]')).toBeVisible();
    }

    async loginWithEmptyEmail() {
        await this.passwordInput.fill('Test123!');
        await this.signInButton.click();
        await expect(this.page.locator('[data-test-id="user-validation-error"]')).toBeVisible();
    }

    async loginWithWrongPassword() {
        await this.login('test@example.com', 'wrongpassword');
        await expect(this.toastError).toContainText('Invalid email or password');
    }

    async loginWithNonExistentUser() {
        await this.login('nonexistent@example.com', 'Test123!');
        await expect(this.toastError).toContainText('Invalid email or password');
    }

    async verifyLoggedInUser(role: 'user' | 'agent' | 'admin') {
        const userEmails = {
            user: 'test@example.com',
            agent: 'agent@example.com',
            admin: 'admin@example.com'
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
