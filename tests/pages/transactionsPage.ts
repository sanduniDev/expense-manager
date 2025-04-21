import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class TransactionsPage extends BasePage {
    // Selectors
    readonly addTransactionButtonSelector = 'button:has-text("Add Transaction")';
    readonly transactionTableSelector = 'table';
    readonly searchInputSelector = 'input[placeholder="Search transactions..."]';
    readonly categoryFilterSelector = '#category';
    readonly typeFilterSelector = '#type';
    readonly dialogSelector = '[role="dialog"]';
    readonly amountInputSelector = 'input[name="amount"]';
    readonly typeDropdownSelector = 'button:has-text("Select type")';
    readonly categoryDropdownSelector = 'button:has-text("Select category")';
    readonly datePickerSelector = 'button:has-text("Pick a date")';
    readonly saveTransactionButtonSelector = 'button:has-text("Save Transaction")';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to the transactions page
     */
    async navigateToTransactionsPage() {
        await this.navigate('/dashboard/transactions');
        await this.waitForNetwork();
        await this.page.waitForSelector(this.addTransactionButtonSelector);
    }

    /**
     * Verify if the transactions page is displayed
     */
    async isTransactionsPageDisplayed() {
        return await this.isVisible(this.addTransactionButtonSelector);
    }

    /**
     * Open the Add Transaction dialog
     */
    async openAddTransactionDialog() {
        await this.clickElement(this.addTransactionButtonSelector);
        await this.page.waitForSelector(this.dialogSelector);
    }

    /**
     * Fill the Add Transaction form
     */
    async fillAddTransactionForm({
        amount,
        type,
        category,
        description,
    }: {
        amount: string;
        type: string;
        category: string;
        description?: string;
    }) {
        await this.fillInput(this.amountInputSelector, amount);
        await this.selectDropdown(this.typeDropdownSelector, type.charAt(0).toUpperCase() + type.slice(1));
        await this.selectDropdown(this.categoryDropdownSelector, category.charAt(0).toUpperCase() + category.slice(1));
        if (description) {
            await this.fillInput('textarea', description);
        }
    }

    /**
     * Save the transaction
     */
    async saveTransaction() {
        await this.clickElement(this.saveTransactionButtonSelector);
    }
}