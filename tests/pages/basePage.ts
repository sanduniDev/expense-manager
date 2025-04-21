// tests/pages/basePage.ts
import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly baseUrl: string;

    constructor(page: Page) {
        this.page = page;
        // Set your application's base URL here
        this.baseUrl = 'http://localhost:3000'; // Change this to match your development server URL
    }

    /**
     * Navigate to a specific URL
     */
    async navigate(url: string) {
        await this.page.goto(`${this.baseUrl}${url}`);
    }

    /**
     * Wait for navigation to complete
     */
    async waitForNetwork() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Get element by test ID
     */
    async getByTestId(testId: string) {
        return this.page.getByTestId(testId);
    }

    /**
     * Fill input field
     */
    async fillInput(selector: string, value: string) {
        await this.page.fill(selector, value);
    }

    /**
     * Click on element
     */
    async clickElement(selector: string) {
        await this.page.click(selector);
    }

    /**
     * Check if element is visible
     */
    async isVisible(selector: string) {
        await this.page.waitForSelector(selector);
        return await this.page.isVisible(selector);
    }

    /**
     * Get text from element
     */
    async getText(selector: string) {
        return await this.page.textContent(selector);
    }

    /**
     * Wait for toast notification
     */
    async waitForToast(text: string) {
        await this.page.waitForSelector(`text=${text}`);
    }
    /**
     * Select an option from a dropdown
     * @param dropdownSelector - The selector for the dropdown element
     * @param optionText - The visible text or value of the option to select
     */
    async selectDropdown(accessButton: string, optionText: string) {
        await this.page.click(accessButton);
        await this.page.getByRole('option', { name: optionText }).click();
    }
    async checkToastMessage(text: string) {
        await this.waitForToast(text);
        const toastContent = await this.page.textContent(`text=${text}`);
        return toastContent?.includes(text);
    }
    async getDialog(name: string) {
        return await this.page.getByRole('dialog', { name: name })
    }
    async isAvailable(selector: string) {
        return await this.page.isVisible(selector);
    }
}