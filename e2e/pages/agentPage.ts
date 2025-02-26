
import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

export class AgentPage {
    readonly page: Page;
    // Grid cards
    readonly firstGridCard: Locator;
    readonly secondGridCard: Locator;
    readonly thirdGridCard: Locator;
    
    // Navigation and menu
    readonly addPropertyButton: Locator;
    readonly userMenu: Locator;
    readonly dashboardLink: Locator;
    readonly settingsButton: Locator;
    readonly contentGrid: Locator;

    // Profile inputs
    readonly fullNameInput: Locator;
    readonly emailAddressInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly saveProfileButton: Locator;
    readonly currentPasswordInput: Locator;
    readonly newPasswordInput: Locator;

    // Property Creation Elements
    readonly propertyTitle: Locator;
    readonly propertyPrice: Locator;
    readonly propertyBedrooms: Locator;
    readonly propertyBathrooms: Locator;
    readonly propertyArea: Locator;
    readonly propertyYearBuilt: Locator;
    readonly propertyAddress: Locator;
    readonly propertyCity: Locator;
    readonly propertyState: Locator;
    readonly propertyZipCode: Locator;
    readonly propertyDescription: Locator;
    readonly submitPropertyButton: Locator;
    readonly userMenuIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Grid cards
        this.firstGridCard = page.locator('.md\\:grid-cols-3 > :nth-child(1)');
        this.secondGridCard = page.locator('.md\\:grid-cols-3 > :nth-child(2)');
        this.thirdGridCard = page.locator('.md\\:grid-cols-3 > :nth-child(3)');
        
        // Navigation and menu
        this.addPropertyButton = page.locator('.flex > .inline-flex');
        this.userMenu = page.locator('.h-8');
        this.dashboardLink = page.locator('[href="/dashboard"]');
        this.settingsButton = page.locator('[href="/settings"]');
        this.contentGrid = page.locator('.text-center');

        // Profile inputs
        this.fullNameInput = page.locator('.space-y-6 > :nth-child(2) > :nth-child(1) > div.w-full > .w-full');
        this.emailAddressInput = page.locator('.space-y-6 > :nth-child(2) > :nth-child(2) > div.w-full > .w-full');
        this.phoneNumberInput = page.locator(':nth-child(3) > div.w-full > .w-full');
        this.saveProfileButton = page.locator('.pt-6 > .inline-flex');
        this.currentPasswordInput = page.locator('.pt-4 > .space-y-4 > :nth-child(1) > div.w-full > .w-full');
        this.newPasswordInput = page.locator('.pt-4 > .space-y-4 > :nth-child(2) > div.w-full > .w-full');

        // Property Creation Elements
        this.propertyTitle = page.locator('.space-y-6 > :nth-child(2) > :nth-child(1) > .w-full');
        this.propertyPrice = page.locator('.space-y-6 > :nth-child(2) > :nth-child(3) > .w-full');
        this.propertyBedrooms = page.locator(':nth-child(5) > .w-full');
        this.propertyBathrooms = page.locator(':nth-child(2) > :nth-child(6) > .w-full');
        this.propertyArea = page.locator(':nth-child(7) > .w-full');
        this.propertyYearBuilt = page.locator(':nth-child(8) > .w-full');
        this.propertyAddress = page.locator(':nth-child(3) > .grid > :nth-child(1) > .w-full');
        this.propertyCity = page.locator(':nth-child(3) > .grid > :nth-child(2) > .w-full');
        this.propertyState = page.locator(':nth-child(3) > .grid > :nth-child(3) > .w-full');
        this.propertyZipCode = page.locator(':nth-child(3) > .grid > :nth-child(4) > .w-full');
        this.propertyDescription = page.locator('.space-y-6 > :nth-child(4) > .w-full');
        this.submitPropertyButton = page.locator('.justify-end > .bg-blue-600');
        this.userMenuIcon = page.locator('.flex > .h-8');
    }

    async verifyDashboard() {
        // Verify cards are visible and have content
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

    async navigateToSettings() {
        await this.userMenuIcon.click();
        await this.page.getByText('Settings').click();
        await expect(this.page).toHaveURL(/.*\/settings/);
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

    async createProperty(propertyData: {
        title: string;
        price: string;
        bedrooms: string;
        bathrooms: string;
        area: string;
        yearBuilt: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        description: string;
    }) {
        await this.addPropertyButton.click();
        await this.propertyTitle.fill(propertyData.title);
        await this.propertyPrice.fill(propertyData.price);
        await this.propertyBedrooms.fill(propertyData.bedrooms);
        await this.propertyBathrooms.fill(propertyData.bathrooms);
        await this.propertyArea.fill(propertyData.area);
        await this.propertyYearBuilt.fill(propertyData.yearBuilt);
        await this.propertyAddress.fill(propertyData.address);
        await this.propertyCity.fill(propertyData.city);
        await this.propertyState.fill(propertyData.state);
        await this.propertyZipCode.fill(propertyData.zipCode);
        await this.propertyDescription.fill(propertyData.description);
        await this.submitPropertyButton.click();

        // Verify property was created
        await expect(this.page.getByText(propertyData.title)).toBeVisible();
        await expect(this.page.getByText(propertyData.address)).toBeVisible();
    }

    async verifyEmptyPropertyValidation() {
        await this.addPropertyButton.click();
        await this.submitPropertyButton.click();

        // Verify validation messages
        await expect(this.page.getByText('Title must be at least 5 characters')).toBeVisible();
        await expect(this.page.getByText('Price is required')).toBeVisible();
        await expect(this.page.getByText('Number of bedrooms is required')).toBeVisible();
        await expect(this.page.getByText('Number of bathrooms is required')).toBeVisible();
        await expect(this.page.getByText('Area is required')).toBeVisible();
        await expect(this.page.getByText('Year built is required')).toBeVisible();
        await expect(this.page.getByText('Address is required')).toBeVisible();
        await expect(this.page.getByText('City is required')).toBeVisible();
        await expect(this.page.getByText('State is required')).toBeVisible();
        await expect(this.page.getByText('ZIP code is required')).toBeVisible();
        await expect(this.page.getByText('Description must be at least 20 characters')).toBeVisible();
    }

    async sendMessageToAgent() {
        const messageData = {
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            message: 'I am interested in this property and would like to schedule a viewing.'
        };

        await this.page.locator(':nth-child(5) > .inline-flex').click();
        await this.page.locator('.border').click();

        await this.page.locator('form.space-y-4 > :nth-child(1) > .w-full').fill(messageData.name);
        await this.page.locator('form.space-y-4 > :nth-child(2) > .w-full').fill(messageData.email);
        await this.page.locator('form.space-y-4 > :nth-child(3) > .w-full').fill(messageData.phone);
        await this.page.locator(':nth-child(4) > .w-full').fill(messageData.message);

        await this.page.locator('.flex > .bg-blue-600').click();

        await expect(this.page.getByText('Message Sent!')).toBeVisible();
        await expect(this.page.getByText('will get back to you soon')).toBeVisible();
    }
}
