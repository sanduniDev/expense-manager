import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class BudgetPage extends BasePage {
    readonly addBudgetButtonSelector = 'button:has-text("Add Budget")';
    readonly categoryDropdownSelector = 'button:has-text("Select category")';
    readonly amountInputSelector = 'input[name="amount"]';
    readonly periodDropdownSelector = 'button:has-text("Select period")';
    readonly saveBudgetButtonSelector = 'button:has-text("Save Budget")';
    readonly updateBudgetButtonSelector = 'button:has-text("Update Budget")';
    readonly deleteBudgetConfirmButtonSelector = 'button:has-text("Delete")';
    readonly totalBudgetSelector = 'text=Total Budget';
    readonly totalBudgetTestID = 'total-budget-card';
    readonly totalSpentSelector = 'text=Total Spent';
    readonly remainingSelector = 'text=Remaining';
    readonly budgetStatusSelector = 'text=Budget Status';
    readonly newBudgetDialogName = "New Budget"
    readonly homeBudgetText = "Housing"
    readonly foodBudgetText = "Food"
    readonly transportBudgetText = "Transport"

    constructor(page: Page) {
        super(page);
    }

    async getBudgetCardSelector(selector: string) {
        return `[data-slot="card-title"]:has-text("${selector}")`
    }
    async getBudgetCardUpdateSelector(selector: string) {
        return `[data-slot="card-title"]:has-text("${selector}") ~ div button:has(svg.lucide-pen)`
    }
    async getBudgetCardDeleteSelector(selector: string) {
        return `[data-slot="card-title"]:has-text("${selector}") ~ div button:has(svg.lucide-trash2)`
    }
    async navigateToBudgetPage() {
        await this.navigate('/dashboard/budgets');
        await this.waitForNetwork();
        await this.page.waitForSelector(this.totalBudgetSelector);
    }

    async clickAddBudgetButton() {
        await this.page.waitForSelector(this.addBudgetButtonSelector);
        await this.clickElement(this.addBudgetButtonSelector);
    }

    async fillBudgetForm(category: string, amount: string, period: string) {
        if (category != '') {
            await this.selectDropdown(this.categoryDropdownSelector, category);
        }
        await this.fillInput(this.amountInputSelector, amount);
        if (period != '') {
            await this.selectDropdown(this.periodDropdownSelector, period);
        }
    }

    async saveBudget() {
        await this.clickElement(this.saveBudgetButtonSelector);
        await this.waitForNetwork();
    }
    async updateBudget() {
        await this.clickElement(this.updateBudgetButtonSelector);
        await this.waitForNetwork()
    }

    async editBudget(selector: string, amount: string) {
        await this.clickElement(selector);
        await this.fillInput(this.amountInputSelector, amount);
        await this.updateBudget();
    }
    async deleteBudget(selector: string) {
        await this.clickElement(selector);
        await this.page.waitForSelector(this.deleteBudgetConfirmButtonSelector);
        await this.clickElement(this.deleteBudgetConfirmButtonSelector);
        await this.waitForNetwork()
    }

    async isBudgetCardVisible(cardName: string) {
        await this.page.locator(await this.getBudgetCardSelector(cardName)).waitFor({ state: 'visible' });
        return await this.page.locator(await this.getBudgetCardSelector(cardName)).isVisible
    }

    async getSummaryBoxText(selector: string) {
        return (await this.getByTestId(selector)).textContent();
    }

    async deleteBudgetIfExists(budget: string) {
        const budgetCardSelector = await this.getBudgetCardSelector(budget);
        if (await this.isAvailable(budgetCardSelector)) {
            const deleteButtonSelector = await this.getBudgetCardDeleteSelector(budget);
            await this.deleteBudget(deleteButtonSelector);
            await this.waitForToast('Budget deleted successfully');
        }
    }

}