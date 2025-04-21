import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { TransactionsPage } from '../pages/transactionsPage';

test.describe('Transactions Page', () => {
    let loginPage: LoginPage;
    let transactionsPage: TransactionsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        transactionsPage = new TransactionsPage(page);

        await loginPage.navigateToLoginPage();
        await loginPage.login('already.registered@example.com', 'securePassword123');
        await page.waitForURL('**/dashboard', { waitUntil: "networkidle" });
        await transactionsPage.navigateToTransactionsPage();
    });

    test('Navigate to Transactions Page and verify elements', async () => {
        const isDisplayed = await transactionsPage.isTransactionsPageDisplayed();
        expect(isDisplayed).toBeTruthy();

        await transactionsPage.page.waitForSelector(transactionsPage.transactionTableSelector);
        const isTableVisible = await transactionsPage.isVisible(transactionsPage.transactionTableSelector);
        expect(isTableVisible).toBeTruthy();
    });

    test('Add a new transaction', async () => {

        await transactionsPage.openAddTransactionDialog();

        const transactionData = {
            amount: '100.00',
            type: 'income',
            category: 'Salary',
            description: 'Monthly salary',
        };
        await transactionsPage.fillAddTransactionForm(transactionData);

        await transactionsPage.saveTransaction();

        const toast = await transactionsPage.checkToastMessage("Transaction created succesfully");
        expect(toast).toBeTruthy();
    });

    test('Validate Add Transaction form', async ({ page }) => {

        await transactionsPage.openAddTransactionDialog();

        await transactionsPage.saveTransaction();

        const amountError = await page.isVisible('text=Amount is required');
        const typeError = await page.isVisible('text=Type is required');
        const categoryError = await page.isVisible('text=Category is required');

        expect(amountError).toBeTruthy();
        expect(typeError).toBeTruthy();
        expect(categoryError).toBeTruthy();
    });
});