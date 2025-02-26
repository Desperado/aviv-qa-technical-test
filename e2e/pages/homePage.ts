
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly realEstateLink: Locator;
    readonly propertiesLink: Locator;
    readonly agentsLink: Locator;
    readonly aboutLink: Locator;
    readonly loginLink: Locator;
    readonly mainHeading: Locator;
    readonly subHeading: Locator;
    readonly locationInput: Locator;
    readonly minPriceInput: Locator;
    readonly maxPriceInput: Locator;
    readonly propertyTypeDropdown: Locator;
    readonly bedsDropdown: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly viewDetailsButton: Locator;
    readonly messageAgentButton: Locator;

    // Properties search elements
    readonly propertiesSearchLocationInput: Locator;
    readonly propertiesSearchMinPriceInput: Locator;
    readonly propertiesSearchMaxPriceInput: Locator;
    readonly propertiesSearchAllTypesInput: Locator;
    readonly propertiesSearchAnyBedsInput: Locator;
    readonly propertiesSearchButton: Locator;
    readonly propertiesSearchResetButton: Locator;

    // Agents search elements
    readonly agentsSearchInput: Locator;
    readonly agentsSpecializationDropdown: Locator;
    readonly agentsLocationInput: Locator;
    readonly agentsSearchButton: Locator;
    readonly agentsResultGrid: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Main navigation
        this.realEstateLink = page.locator(':nth-child(1) > .flex > .ml-2');
        this.propertiesLink = page.locator('[href="/properties"]');
        this.agentsLink = page.locator('[href="/agents"]');
        this.aboutLink = page.locator('[href="/about"]');
        this.loginLink = page.locator('.ml-4 > .ml-2');
        
        // Main content
        this.mainHeading = page.locator('.text-4xl');
        this.subHeading = page.locator('.text-center > .text-xl');
        
        // Search inputs
        this.locationInput = page.locator(':nth-child(1) > div.w-full > .block');
        this.minPriceInput = page.locator(':nth-child(2) > div.w-full > .block');
        this.maxPriceInput = page.locator(':nth-child(3) > div.w-full > .block');
        this.propertyTypeDropdown = page.locator(':nth-child(4) > div.w-full > .block');
        this.bedsDropdown = page.locator(':nth-child(5) > div.w-full > .block');
        this.searchButton = page.locator('[data-test-id="search-properties-button"]');
        this.resetButton = page.locator('.md\\:col-span-2 > .border');
        this.viewDetailsButton = page.locator(':nth-child(5) > .inline-flex');
        this.messageAgentButton = page.locator('.border');

        // Properties search elements
        this.propertiesSearchLocationInput = page.locator(':nth-child(1) > div.w-full > .block');
        this.propertiesSearchMinPriceInput = page.locator(':nth-child(2) > div.w-full > .block');
        this.propertiesSearchMaxPriceInput = page.locator(':nth-child(3) > div.w-full > .block');
        this.propertiesSearchAllTypesInput = page.locator(':nth-child(4) > div.w-full > .block');
        this.propertiesSearchAnyBedsInput = page.locator(':nth-child(5) > div.w-full > .block');
        this.propertiesSearchButton = page.locator('.md\\:col-span-2 > .bg-blue-600');
        this.propertiesSearchResetButton = page.locator('.md\\:col-span-2 > .border');

        // Agents search elements
        this.agentsSearchInput = page.locator('.relative > div.w-full > .block');
        this.agentsSpecializationDropdown = page.locator('.w-48 > div.w-full > .block');
        this.agentsLocationInput = page.locator(':nth-child(3) > div.w-full > .block');
        this.agentsSearchButton = page.locator('.flex > .bg-blue-600');
        this.agentsResultGrid = page.locator('.mt-8 > .grid');
    }

    async visit() {
        await this.page.goto('/');
    }

    async searchProperty(data = {
        location: 'Los Angeles',
        minPrice: '100000',
        maxPrice: '500000',
        propertyType: 'For Sale',
        beds: '2+ Beds'
    }) {
        await this.locationInput.fill(data.location);
        await this.minPriceInput.fill(data.minPrice);
        await this.maxPriceInput.fill(data.maxPrice);
        await this.propertyTypeDropdown.selectOption(data.propertyType);
        await this.bedsDropdown.selectOption(data.beds);
        await this.searchButton.click();
    }

    async verifyMainHeading() {
        await expect(this.mainHeading).toHaveText('Find Your Dream Property');
    }

    async verifySubHeading() {
        await expect(this.subHeading).toHaveText('Discover the perfect home from our extensive collection of properties');
    }

    async verifyPropertyTypeDropdown(value = 'All Types') {
        await expect(this.propertyTypeDropdown).toHaveValue(value);
    }

    async verifyBedsDropdown(value = 'Any Beds') {
        await expect(this.bedsDropdown).toHaveValue(value);
    }

    async searchPropertiesFromHome(searchData = {
        location: 'Los Angeles',
        minPrice: '200000',
        maxPrice: '500000',
        type: 'For Sale',
        beds: '2+ Beds'
    }) {
        await this.propertiesLink.click();
        await this.propertiesSearchLocationInput.fill(searchData.location);
        await this.propertiesSearchMinPriceInput.fill(searchData.minPrice);
        await this.propertiesSearchMaxPriceInput.fill(searchData.maxPrice);
        await this.propertiesSearchAllTypesInput.selectOption(searchData.type);
        await this.propertiesSearchAnyBedsInput.selectOption(searchData.beds);
        await this.propertiesSearchButton.click();

        // Check for results
        const hasResults = await this.page.locator('.relative > .w-full').isVisible();
        if (!hasResults) {
            await expect(this.page.getByText('No properties match your search criteria.')).toBeVisible();
            await expect(this.page.getByText('Try adjusting your filters or search terms.')).toBeVisible();

            // Reset and try with just location
            await this.propertiesSearchResetButton.click();
            await this.propertiesSearchLocationInput.fill(searchData.location);
            await this.propertiesSearchButton.click();
        }
    }

    async resetPropertiesSearch() {
        await this.propertiesSearchResetButton.click();
        await expect(this.propertiesSearchLocationInput).toBeEmpty();
        await expect(this.propertiesSearchMinPriceInput).toBeEmpty();
        await expect(this.propertiesSearchMaxPriceInput).toBeEmpty();
        await expect(this.propertiesSearchAllTypesInput).toHaveValue('');
        await expect(this.propertiesSearchAnyBedsInput).toHaveValue('');
    }

    async searchPropertiesWithLocationOnly(location = 'Los Angeles') {
        await this.propertiesLink.click();
        await this.propertiesSearchResetButton.click();
        await this.propertiesSearchLocationInput.fill(location);
        await this.propertiesSearchButton.click();

        const hasResults = await this.page.locator('.relative > .w-full').isVisible();
        if (!hasResults) {
            await expect(this.page.getByText('No properties match your search criteria.')).toBeVisible();
        }
    }

    async verifyPropertiesSearchForm() {
        await expect(this.propertiesSearchLocationInput).toBeVisible();
        await expect(this.propertiesSearchMinPriceInput).toBeVisible();
        await expect(this.propertiesSearchMaxPriceInput).toBeVisible();
        await expect(this.propertiesSearchAllTypesInput).toBeVisible();
        await expect(this.propertiesSearchAnyBedsInput).toBeVisible();
        await expect(this.propertiesSearchButton).toBeVisible();
        await expect(this.propertiesSearchResetButton).toBeVisible();
    }

    async searchAgentsFromHome(searchData = {
        name: '',
        specialization: 'Luxury Properties',
        location: 'Los Angeles'
    }) {
        await this.agentsLink.click();
        
        if (searchData.name) {
            await this.agentsSearchInput.fill(searchData.name);
        }
        
        await this.agentsSpecializationDropdown.selectOption(searchData.specialization);
        await this.agentsLocationInput.fill(searchData.location);
        await this.agentsSearchButton.click();

        const hasResults = await this.agentsResultGrid.isVisible();
        if (hasResults) {
            await expect(this.agentsResultGrid).not.toBeEmpty();
            await expect(this.page.getByText('Luxury Properties')).toBeVisible();
        } else {
            await expect(this.page.getByText('No agents match your search criteria.')).toBeVisible();
            
            // Reset and try with just location
            await this.page.locator('.flex > .border').click();
            await this.agentsLocationInput.fill(searchData.location);
            await this.agentsSearchButton.click();
        }
    }

    async verifyAgentSearchForm() {
        await this.agentsLink.click();
        await expect(this.agentsSearchInput).toBeVisible();
        await expect(this.agentsSpecializationDropdown).toBeVisible();
        await expect(this.agentsLocationInput).toBeVisible();
        await expect(this.agentsSearchButton).toBeVisible();
    }

    async clickViewDetails() {
        await this.viewDetailsButton.click();
    }

    async clickLinks() {
        await this.propertiesLink.click();
        await this.page.waitForURL('**/properties');
        
        await this.agentsLink.click();
        await this.page.waitForURL('**/agents');
        
        await this.aboutLink.click();
        await this.page.waitForURL('**/about');
        
        await this.loginLink.click();
        await this.page.waitForURL('**/login');
    }
}
