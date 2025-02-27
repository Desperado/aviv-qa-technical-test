import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { AgentPage } from '../pages/agentPage';
import testData from '../data/testData.json' assert { type: 'json' };

test.describe('Home Page Tests', () => {
    let homePage: HomePage;
    let agentPage: AgentPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        agentPage = new AgentPage(page);
        await homePage.visit();
    });

    test('should verify main and sub headings', async () => {
        await homePage.verifyMainHeading();
        await homePage.verifySubHeading();
    });

    test('should reset the search form correctly', async () => {
        await homePage.searchProperty();
        await homePage.resetPropertiesSearch();
        
        await expect(homePage.locationInput).toBeEmpty();
        await expect(homePage.minPriceInput).toBeEmpty();
        await expect(homePage.maxPriceInput).toBeEmpty();
        await homePage.verifyPropertyTypeDropdown();
        await homePage.verifyBedsDropdown();
    });

    test('should ensure UI elements are clickable and lead to correct pages', async ({ page }) => {
        await homePage.clickLinks();
    });

    test('should view property details and validate URL', async ({ page }) => {
        await homePage.searchProperty();
        await homePage.clickViewDetails();
        await expect(page).toHaveURL(/\/properties\/p1/);
    });

    test('should verify sending message to agent', async ({ page }) => {
        await homePage.agentsLink.click();
        await agentPage.sendMessageButton.click()
        await agentPage.sendMessageToAgent();
        // Add assertions to verify the message was sent successfully
    });

    test('should verify search of properties', async ({ page }) => {
        // Full search
        await homePage.searchPropertiesFromHome();
        
        // Search with location only
        await homePage.searchPropertiesWithLocationOnly();
        
        // Reset and verify
        await homePage.resetPropertiesSearch();
    });

    test('should verify search of agents', async () => {
        await homePage.searchAgentsFromHome();
        await homePage.verifyAgentSearchForm();
    });
});
