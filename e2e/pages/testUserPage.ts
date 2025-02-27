
import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

export class TestUserPage {
    readonly page: Page;
    readonly firstGridCard: Locator;
    readonly secondGridCard: Locator;
    readonly thirdGridCard: Locator;
    readonly menuButton: Locator;
    readonly firstMenuItem: Locator;
    readonly userMenu: Locator;
    readonly dashboardLink: Locator;
    readonly settingsButton: Locator;
    readonly contentGrid: Locator;
    readonly fullNameInput: Locator;
    readonly emailAddressInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly saveProfileButton: Locator;
    readonly currentPasswordInput: Locator;
    readonly newPasswordInput: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstGridCard = page.locator('.md\\:grid-cols-3 > :nth-child(1)');
        this.secondGridCard = page.locator('.md\\:grid-cols-3 > :nth-child(2)');
        this.thirdGridCard = page.locator('.md\\:grid-cols-3 > :nth-child(3)');
        this.menuButton = page.locator('.ml-2');
        this.firstMenuItem = page.locator(':nth-child(1) > .relative > .p-2');
        this.userMenu = page.locator('.h-8');
        this.dashboardLink = page.locator('[href="/dashboard"]');
        this.settingsButton = page.locator('[href="/settings"]');
        this.contentGrid = page.locator('.md\\:grid-cols-2');
        this.fullNameInput = page.locator('.space-y-6 > :nth-child(2) > :nth-child(1) > div.w-full > .w-full');
        this.emailAddressInput = page.locator('.space-y-6 > :nth-child(2) > :nth-child(2) > div.w-full > .w-full');
        this.phoneNumberInput = page.locator(':nth-child(3) > div.w-full > .w-full');
        this.saveProfileButton = page.locator('.pt-6 > .inline-flex');
        this.currentPasswordInput = page.locator('.pt-4 > .space-y-4 > :nth-child(1) > div.w-full > .w-full');
        this.newPasswordInput = page.locator('.pt-4 > .space-y-4 > :nth-child(2) > div.w-full > .w-full');
        this.logoutButton = page.locator('.absolute > .w-full');
    }

    async verifyDashboard() {
        await expect(this.firstGridCard).toBeVisible();
        await expect(this.firstGridCard.locator('.text-3xl')).toBeVisible();
        await expect(this.firstGridCard.locator('.text-3xl')).not.toBeEmpty();

        await expect(this.secondGridCard).toBeVisible();
        await expect(this.secondGridCard.locator('.text-3xl')).toBeVisible();
        await expect(this.secondGridCard.locator('.text-3xl')).not.toBeEmpty();

        await expect(this.thirdGridCard).toBeVisible();
        await expect(this.thirdGridCard.locator('.text-3xl')).toBeVisible();
        await expect(this.thirdGridCard.locator('.text-3xl')).not.toBeEmpty();
    }

    async navigateAndVerifyMenu() {
        await this.menuButton.click();
        await this.page.locator('.my-12 > .grid > :nth-child(1) > .relative > .p-2').click();
        await this.userMenu.click();
        await this.dashboardLink.click();
        await expect(this.page).toHaveURL(/.*\/dashboard/);
        await expect(this.contentGrid).toBeVisible();
        await expect(this.contentGrid).not.toBeEmpty();
    }

    async verifyContentGrid() {
        await expect(this.contentGrid).toBeVisible();
        await expect(this.contentGrid).not.toBeEmpty();
    }

    async navigateToSettings() {
        await this.settingsButton.click();
    }

    async updateProfile(name: string, email: string, phone: string) {
        await this.fullNameInput.clear();
        await this.fullNameInput.fill(name);
        await this.emailAddressInput.clear();
        await this.emailAddressInput.fill(email);
        await this.phoneNumberInput.clear();
        await this.phoneNumberInput.fill(phone);
        await this.saveProfileButton.click();
    }

    async changePassword(currentPassword: string, newPassword: string) {
        await this.currentPasswordInput.fill(currentPassword);
        await this.newPasswordInput.fill(newPassword);
        await this.saveProfileButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async logoutAndVerify() {
        await this.logout();
        await expect(this.page).toHaveURL(/.*\/login/);
        await expect(this.page.locator('[data-testid="email"]')).toBeVisible();
        await expect(this.page.locator('[data-testid="password"]')).toBeVisible();
    }

    async updateAndVerifyProfile() {
        const profileData = {
            name: 'Admin User',
            email: 'admin@updated.com',
            phone: '9876543210'
        };

        await this.updateProfile(profileData.name, profileData.email, profileData.phone);
        await expect(this.page.locator('.success-message')).toBeVisible();
        await expect(this.page.locator('.success-message')).toContainText('Profile updated successfully');
        await expect(this.fullNameInput).toHaveValue(profileData.name);
        await expect(this.emailAddressInput).toHaveValue(profileData.email);
        await expect(this.phoneNumberInput).toHaveValue(profileData.phone);
    }

    async changeAndVerifyPassword() {
        await this.changePassword('Test123!', 'NewTest123!');
        await expect(this.page.locator('.success-message')).toBeVisible();
        await expect(this.page.locator('.success-message')).toContainText('Password changed successfully');
        await expect(this.currentPasswordInput).toHaveValue('');
        await expect(this.newPasswordInput).toHaveValue('');
    }

    async updateProfileAndVerify() {
        const updatedCredentials = {
            name: 'Test User',
            email: 'test@updated.com',
            phone: '9876543210',
            currentPassword: 'Test123!',
            newPassword: 'NewTest123!'
        };

        await this.navigateToSettings();
        await this.updateProfile(updatedCredentials.name, updatedCredentials.email, updatedCredentials.phone);
        await expect(this.page.getByText('Settings updated successfully')).toBeVisible();

        await this.changePassword(updatedCredentials.currentPassword, updatedCredentials.newPassword);
        await this.userMenu.click();
        await this.logoutButton.click();
        
        await expect(this.page).toHaveURL(/.*\/login/);

        const loginPage = new LoginPage(this.page);
        await loginPage.login(updatedCredentials.email, updatedCredentials.newPassword);
        await this.userMenu.click();
        await expect(this.page.getByText(updatedCredentials.email)).toBeVisible();
    }
}
