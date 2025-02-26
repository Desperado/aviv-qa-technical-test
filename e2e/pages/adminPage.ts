import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
    readonly page: Page;
    
    // Cards
    readonly totalUsersCard: Locator;
    readonly propertiesCard: Locator;
    readonly agentsCard: Locator;
    readonly activeListingsCard: Locator;
    
    // Navigation Buttons
    readonly propertiesButton: Locator;
    readonly usersButton: Locator;
    readonly agentsButton: Locator;
    readonly successMessage: Locator;
    
    // Properties Section
    readonly searchProperties: Locator;
    readonly statusDropdown: Locator;
    readonly resetButton: Locator;
    readonly deletePropertyButton: Locator;
    readonly confirmDeleteProperty: Locator;
    
    // Users Section
    readonly searchUsers: Locator;
    readonly rolesDropdown: Locator;
    readonly editUserButton: Locator;
    readonly userNameInput: Locator;
    readonly userEmailInput: Locator;
    readonly userPhoneInput: Locator;
    readonly userRoleDropdown: Locator;
    readonly saveChangesButton: Locator;
    readonly deleteUserButton: Locator;
    readonly deleteUserModalButton: Locator;
    
    // Agents Section
    readonly searchAgents: Locator;
    readonly deleteAgentButton: Locator;
    readonly confirmDeleteAgent: Locator;
    readonly editAgentButton: Locator;
    readonly agentNameInput: Locator;
    readonly agentEmailInput: Locator;
    readonly agentPhoneInput: Locator;
    readonly agentSpecializationDropdown: Locator;
    readonly saveAgentButton: Locator;
    
    // Settings
    readonly settingsButton: Locator;
    readonly profileButton: Locator
    readonly saveProfileButton: Locator;
    readonly fullNameInput: Locator;
    readonly emailAddressInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Cards
        this.totalUsersCard = page.locator('.grid > :nth-child(1)');
        this.propertiesCard = page.locator('.grid > :nth-child(2)');
        this.agentsCard = page.locator('.grid > :nth-child(3)');
        this.activeListingsCard = page.locator('.grid > :nth-child(4)');
        
        // Navigation
        this.successMessage = page.locator('[data-test-id="success-message"]');
        this.propertiesButton = page.locator('.bg-blue-600');
        this.usersButton = page.locator('.flex-col > .flex > :nth-child(2)');
        this.agentsButton = page.locator('.flex-col > .flex > :nth-child(3)');
        
        // Properties Section
        this.searchProperties = page.locator('.relative > div.w-full > .block');
        this.statusDropdown = page.locator('[data-test-id="status-filter-dropdown"]');
        this.resetButton = page.locator(':nth-child(2) > :nth-child(2) > .inline-flex');
        this.deletePropertyButton = page.locator(':nth-child(1) > .text-right > .inline-flex');
        this.confirmDeleteProperty = page.locator('.justify-end > .bg-blue-600');
        
        // Users Section
        this.searchUsers = page.locator('.relative > div.w-full > .block');
        this.rolesDropdown = page.locator('.w-48 > div.w-full > .block');
        this.editUserButton = page.locator(':nth-child(1) > .text-right > .mr-2');
        this.userNameInput = page.locator('.space-y-4 > :nth-child(1) > .w-full');
        this.userEmailInput = page.locator('.space-y-4 > :nth-child(2) > .w-full');
        this.userPhoneInput = page.locator('.space-y-4 > :nth-child(3) > .w-full');
        this.userRoleDropdown = page.locator(':nth-child(4) > .w-full');
        this.saveChangesButton = page.locator('.space-y-4 > .flex > .bg-blue-600');
        this.deleteUserButton = page.locator(':nth-child(1) > .text-right > .text-red-600');
        this.deleteUserModalButton = page.locator('.justify-end > .bg-blue-600');
        
        // Agents Section
        this.searchAgents = page.locator('.relative > div.w-full > .block');
        this.deleteAgentButton = page.locator(':nth-child(1) > .text-right > .inline-flex');
        this.confirmDeleteAgent = page.locator('.justify-end > .bg-blue-600');
        this.editAgentButton = page.locator(':nth-child(1) > .text-right > .mr-2');
        this.agentNameInput = page.locator('.space-y-4 > :nth-child(1) > .w-full');
        this.agentEmailInput = page.locator('.space-y-4 > :nth-child(2) > .w-full');
        this.agentPhoneInput = page.locator('.space-y-4 > :nth-child(3) > .w-full');
        this.agentSpecializationDropdown = page.locator(':nth-child(4) > .w-full');
        this.saveAgentButton = page.locator('.space-y-4 > .flex > .bg-blue-600');
        
        // Settings
        this.profileButton = page.locator('.flex > .h-8');
        this.settingsButton = page.locator('[href="/settings"]');
        this.saveProfileButton = page.locator('.pt-6 > .inline-flex');
        this.fullNameInput = page.locator('.space-y-6 > :nth-child(2) > :nth-child(1) > div.w-full > .w-full');
        this.emailAddressInput = page.locator('.space-y-6 > :nth-child(2) > :nth-child(2) > div.w-full > .w-full');
        this.phoneNumberInput = page.locator(':nth-child(3) > div.w-full > .w-full');
        this.logoutButton = page.locator('.absolute > .w-full');
    }

    async verifyDashboardCards() {
        for (const card of [this.totalUsersCard, this.propertiesCard, this.agentsCard, this.activeListingsCard]) {
            await expect(card.locator('.text-3xl')).toHaveText(/\d+/);
        }
    }

    async navigateToProperties() {
        await this.propertiesButton.click();
    }

    async navigateToUsers() {
        await this.usersButton.click();
    }

    async navigateToAgents() {
        await this.agentsButton.click();
    }

    async searchProperty(searchText: string) {
        await this.searchProperties.fill(searchText);
    }

    async filterPropertyByStatus(status: string) {
        await this.statusDropdown.waitFor({ state: 'visible', timeout: 60000 });
        await this.statusDropdown.selectOption(status);
    }

    async deleteProperty() {
        await this.deletePropertyButton.click();
        await this.confirmDeleteProperty.click();
    }

    async editUser(userData: { name: string; email: string; phone: string; role: string }) {
        await this.editUserButton.click();
        await this.userNameInput.fill(userData.name);
        await this.userEmailInput.fill(userData.email);
        await this.userPhoneInput.fill(userData.phone);
        await this.userRoleDropdown.selectOption(userData.role);
        await this.saveChangesButton.click();
    }

    async deleteUser() {
        const initialCount = await this.totalUsersCard.locator('.text-3xl').textContent();
        await this.deleteUserButton.click();
        await this.deleteUserModalButton.click();
        await expect(this.totalUsersCard.locator('.text-3xl')).not.toHaveText(initialCount!);
    }

    async searchUser(searchText: string) {
        await this.searchUsers.fill(searchText);
    }

    async filterUsersByRole(role: string) {
        await this.rolesDropdown.selectOption(role);
    }

    async searchAgent(searchText: string) {
        await this.searchAgents.fill(searchText);
    }

    async deleteAgent() {
        await this.deleteAgentButton.click();
        await this.confirmDeleteAgent.click();
    }

    async filterAgentsBySpecialization(specialization: string) {
        await this.statusDropdown.selectOption(specialization);
    }

    async resetFilters(section: 'properties' | 'users' | 'agents') {
        let initialCount: number;
        let searchInput: Locator;
        let dropdown: Locator;
        let expectedText: string;

        switch (section) {
            case 'properties':
                initialCount = await this.page.locator('table tbody tr').count();
                searchInput = this.searchProperties;
                dropdown = this.statusDropdown;
                expectedText = 'All Statuses';
                break;
            case 'users':
                initialCount = await this.page.locator('table tbody tr').count();
                searchInput = this.searchUsers;
                dropdown = this.rolesDropdown;
                expectedText = 'All Roles';
                break;
            case 'agents':
                initialCount = await this.page.locator('table tbody tr').count();
                searchInput = this.searchAgents;
                dropdown = this.statusDropdown;
                expectedText = 'All Specializations';
                break;
            default:
                throw new Error('Invalid section');
        }

        await this.resetButton.click();
        await expect(searchInput).toBeEmpty();
        await expect(dropdown.locator('option').first()).toContainText(expectedText);
        await expect(this.page.locator('table tbody tr')).not.toHaveCount(initialCount);
    }

    async navigateToSettings() {
        await this.profileButton.click();
        await this.settingsButton.click();
    }

    async updateProfile(name: string, email: string, phone: string) {
        await this.fullNameInput.fill(name);
        await this.emailAddressInput.fill(email);
        await this.phoneNumberInput.fill(phone);
        await this.saveProfileButton.click();
    }

    async logout() {
        await this.logoutButton.click();
        await expect(this.page).toHaveURL(/\/login/);
    }
}