import { test, expect } from '@playwright/test';
import { AgentPage } from '../pages/agentPage';
import { LoginPage } from '../pages/loginPage';

test.describe('Agent Dashboard Tests', () => {
    let agentPage: AgentPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        agentPage = new AgentPage(page);
        loginPage = new LoginPage(page);
        
        // Align: Navigate to login page
        await page.goto('/login');
        
        // Setup: Perform login as agent
        await loginPage.loginAsAgent();
        
        // Validate: Verify logged in and redirected
        await expect(page).toHaveURL(/.*\/dashboard/);
    });

    test('display dashboard correctly for agent role', async () => {
        // Setup: Verify dashboard components
        await agentPage.verifyDashboard();
    });

    test('create property successfully and verify creation', async () => {
        // Align: Property test data
        const propertyData = {
            title: 'Luxury Apartment',
            price: '500000',
            bedrooms: '3',
            bathrooms: '2',
            area: '2000',
            yearBuilt: '2020',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            description: 'A beautiful luxury apartment in the heart of the city'
        };

        // Setup: Create new property
        await agentPage.createProperty(propertyData);
    });

    test('verify empty property validation', async () => {
        // Setup: Test empty form submission validation
        await agentPage.verifyEmptyPropertyValidation();
    });

    test('verify negative values validation', async ({ page }) => {
        // Known bug: System allows negative values
        // Align: Prepare test data with negative values
        const propertyData = {
            title: 'Test Property',
            price: '-500000',
            bedrooms: '-3',
            bathrooms: '-2',
            area: '-2000',
            yearBuilt: '-2020',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            description: 'Property with negative values'
        };

        // Setup: Create property with negative values
        await agentPage.createProperty(propertyData);

        // Validate: Property should be created (this is a bug)
        await expect(page.getByText(propertyData.title)).toBeVisible();
    });

    test('verify message sending to agent', async () => {
        // Known bug: Placeholders are populated with incorrect values
        // Align: Create a property first
        const propertyData = {
            title: 'Test Property',
            price: '500000',
            bedrooms: '3',
            bathrooms: '2',
            area: '2000',
            yearBuilt: '2020',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            description: 'Test property for messaging'
        };
        await agentPage.createProperty(propertyData);
        
        await agentPage.goToAgent();
        // Setup: Send message to agent
        await agentPage.sendMessageToAgent();
    });

    test('verify empty message validation', async ({ page }) => {
        // Align: Create a property first
        const propertyData = {
            title: 'Test Property',
            price: '500000',
            bedrooms: '3',
            bathrooms: '2',
            area: '2000',
            yearBuilt: '2020',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            description: 'Test property for messaging'
        };
        await agentPage.createProperty(propertyData);

        // Setup: Click view details
        await page.locator(':nth-child(5) > .inline-flex').click();
        await page.locator('.border').click();

        // Clear all fields and submit
        await page.locator('form.space-y-4 > :nth-child(1) > .w-full').clear();
        await page.locator('form.space-y-4 > :nth-child(2) > .w-full').clear();
        await page.locator('form.space-y-4 > :nth-child(3) > .w-full').clear();
        await page.locator(':nth-child(4) > .w-full').clear();
        await page.locator('.flex > .bg-blue-600').click();

        // Validate: Verify validation messages
        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('Invalid email address')).toBeVisible();
        await expect(page.getByText('Valid phone number is required')).toBeVisible();
        await expect(page.getByText('Message must be at least 10 characters')).toBeVisible();
    });

    test('update profile settings and verify', async ({ page }) => {
        // Known bug: System does not remember new credentials
        // Align: New profile data
        const updatedProfile = {
            name: 'Updated Agent Name',
            email: 'updated.agent@example.com',
            phone: '9876543210'
        };

        // Setup: Navigate to settings and update profile
        await agentPage.navigateToSettings();
        await agentPage.updateProfile(
            updatedProfile.name,
            updatedProfile.email,
            updatedProfile.phone
        );

        // Validate: Success message should be visible
        await expect(page.getByText('Settings updated successfully')).toBeVisible();
    });
});
