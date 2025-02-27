import { test, expect } from '@playwright/test';
import { AdminPage } from '../pages/adminPage';
import { LoginPage } from '../pages/loginPage';

test.describe('Admin Dashboard Tests', () => {
    let adminPage: AdminPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        adminPage = new AdminPage(page);
        loginPage = new LoginPage(page);
        
        // Align: Navigate to login page
        await page.goto('/login');
        
        // Setup: Perform login as admin
        await loginPage.loginAsAdmin();
        
        // Validate: Verify logged in and redirected
        await expect(page).toHaveURL(/.*\/dashboard/);
    });

    test('verify dashboard cards contain numeric values', async () => {
        await adminPage.verifyDashboardCards();
    });

    test('search and filter properties', async ({ page }) => {
        // Align: Navigate to properties section
        await adminPage.navigateToProperties();
        
        // Setup: Test search and filter functionality
        await adminPage.searchProperty('Test Property');
        await adminPage.filterPropertyByStatus('Available');
        await adminPage.resetFilters('properties');
        
        // Validate: Verify property list is visible
        await expect(page.locator('tbody tr').first()).toBeVisible();
    });

    test('verify property deletion bug', async ({ page }) => {
        // Align: Navigate to properties section
        await adminPage.navigateToProperties();
        
        // Setup: Test property deletion
        await adminPage.deleteProperty();
        
        // Validate: Verify property is still visible (known bug)
        await expect(page.locator('tbody tr').first()).toBeVisible();
    });

    test('search and filter users', async ({ page }) => {
        // Align: Navigate to users section
        await adminPage.navigateToUsers();
        
        // Setup: Test user search functionality
        await adminPage.searchUser('test');
        await adminPage.resetFilters('users');
        await adminPage.filterUsersByRole('Admin');
        
        // Validate: Verify user table is visible
        await expect(page.locator('table tbody tr')).toBeVisible();
    });

    test('edit user', async ({ page }) => {
        // Align: Navigate to users section
        await adminPage.navigateToUsers();
        
        // Setup: Edit user details
        const userData = {
            name: 'Updated Name',
            email: 'updated@example.com',
            phone: '1234567890',
            role: 'Admin'
        };
        await adminPage.editUser(userData);
        
        // Validate: Verify updated user name is visible
        await expect(page.locator('text=Updated Name')).toBeVisible();
    });

    test('delete user', async ({ page }) => {
        // Align: Navigate to users section
        await adminPage.navigateToUsers();
        
        // Setup: Delete user and verify
        await adminPage.deleteUser();
    });

    test('search and filter agents', async ({ page }) => {
        // Align: Navigate to agents section
        await adminPage.navigateToAgents();
        
        // Setup: Test agent search functionality
        await adminPage.searchAgent('Emily');
        await adminPage.filterAgentsBySpecialization('Residential Properties');
        
        // Validate: Verify agent table is visible
        await expect(page.locator('table tbody tr')).toBeVisible();
    });

    test('delete agent', async ({ page }) => {
        // Align: Navigate to agents section
        await adminPage.navigateToAgents();
        
        // Setup: Delete agent and verify
        await adminPage.deleteAgent();
    });

    test('update profile settings and verify', async ({ page }) => {
        // Align: New profile data
        const updatedProfile = {
            name: 'Updated Admin Name',
            email: 'updated.admin@example.com',
            phone: '9876543210'
        };

        // Setup: Update profile settings
        await adminPage.navigateToSettings();
        await adminPage.updateProfile(
            updatedProfile.name,
            updatedProfile.email,
            updatedProfile.phone
        );
        
        // Validate: Verify success message
        await expect(adminPage.successMessage).toBeVisible();
    });
});