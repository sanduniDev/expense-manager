import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/loginPage';
import {BudgetPage} from '../pages/budgetPage';

test.describe('Budget Page Tests', () => {
    let loginPage: LoginPage;
    let budgetPage: BudgetPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        budgetPage = new BudgetPage(page);

        await loginPage.navigateToLoginPage();
        await loginPage.login('already.registered@example.com', 'securePassword123');
        await page.waitForURL('**/dashboard', {waitUntil: "networkidle"});
        await budgetPage.navigateToBudgetPage();
    });
    test.describe('1.1 - Navigation Tests', () => {
        test('1.1.1 - Verify that clicking the "Budget" tab renders the Budget Management screen', async () => {
            expect(await budgetPage.isVisible(budgetPage.totalBudgetSelector)).toBeTruthy();
        });

        test('1.1.2 - Verify that all required elements are rendered', async () => {
            expect(await budgetPage.isVisible(budgetPage.totalBudgetSelector)).toBeTruthy();
            expect(await budgetPage.isVisible(budgetPage.totalSpentSelector)).toBeTruthy();
            expect(await budgetPage.isVisible(budgetPage.remainingSelector)).toBeTruthy();
            expect(await budgetPage.isVisible(budgetPage.budgetStatusSelector)).toBeTruthy();
        });
    });

    test.describe('1.2 - Create Dialog Interaction Tests', () => {
        test('1.2.1 - Verify user interaction with the "+ Add Budget" button', async () => {
            await budgetPage.clickAddBudgetButton();
            expect(await budgetPage.isVisible(budgetPage.categoryDropdownSelector)).toBeTruthy();
        });
        test('1.2.2 - Verify budget creation with invalid data', async () => {
            await budgetPage.clickAddBudgetButton();
            await budgetPage.fillBudgetForm('', '', '');
            await budgetPage.saveBudget();

            expect(await budgetPage.page.textContent('form')).toContain('Please select a category');
            expect(await budgetPage.page.textContent('form')).toContain('Amount must be greater than 0');
            expect(await budgetPage.page.textContent('form')).toContain('Please select a period');
        });
        test('1.2.3 - Verify budget creation with valid data', async () => {
            const currentTotalBudget = await budgetPage.getSummaryBoxValue(budgetPage.totalBudgetTestID)
            await budgetPage.clickAddBudgetButton();
            await budgetPage.fillBudgetForm('Housing', '200000', 'Monthly');
            await budgetPage.saveBudget();

            await budgetPage.waitForToast('Budget created successfully');

            (await budgetPage.getDialog('New Budget')).waitFor({state: 'hidden'})

            expect(await budgetPage.isBudgetCardVisible(budgetPage.homeBudgetText)).toBeTruthy();
            const newTotalBudget = await budgetPage.getSummaryBoxValue(budgetPage.totalBudgetTestID);
            expect(newTotalBudget).toEqual(currentTotalBudget + 200000)

            await budgetPage.deleteBudgetIfExists("Housing")
        });
    });

    test.describe("1.3 - Update Dialog Interaction Tests", () => {

        test('1.3.1 - Verify budget editing with valid data', async () => {
            // Create new budget for Food
            const currentTotalBudget = await budgetPage.getSummaryBoxValue(budgetPage.totalBudgetTestID);
            await budgetPage.clickAddBudgetButton();
            await budgetPage.fillBudgetForm('Food', '150000', 'Monthly');
            await budgetPage.saveBudget();

            await budgetPage.waitForToast('Budget created successfully');
            (await budgetPage.getDialog('New Budget')).waitFor({state: 'hidden'});

            expect(await budgetPage.isBudgetCardVisible(budgetPage.foodBudgetText)).toBeTruthy();
            const newTotalBudget = await budgetPage.getSummaryBoxValue(budgetPage.totalBudgetTestID);
            expect(newTotalBudget).toEqual(currentTotalBudget + 150000)

            await budgetPage.editBudget(await budgetPage.getBudgetCardUpdateSelector('Food'), '250000');
            await budgetPage.waitForToast('Budget updated successfully');
            (await budgetPage.getDialog('Edit Budget')).waitFor({state: 'hidden'})

            const finalTotalBudget = await budgetPage.getSummaryBoxValue(budgetPage.totalBudgetTestID);
            expect(finalTotalBudget).toEqual(currentTotalBudget + 250000)

            await budgetPage.deleteBudgetIfExists("Food")
        });

    });


    test.describe("1.4 - Delete Tests", () => {
        test('1.4.1 - Verify that the user can delete a budget successfully', async () => {

            const currentTotalBudget = await budgetPage.getSummaryBoxValue(budgetPage.totalBudgetTestID);
            await budgetPage.clickAddBudgetButton();
            await budgetPage.fillBudgetForm('Transport', '100000', 'Monthly');
            await budgetPage.saveBudget();

            await budgetPage.waitForToast('Budget created successfully');
            (await budgetPage.getDialog('New Budget')).waitFor({state: 'hidden'});

            expect(await budgetPage.isBudgetCardVisible(budgetPage.transportBudgetText)).toBeTruthy();
            const newTotalBudget = await budgetPage.getSummaryBoxValue(budgetPage.totalBudgetTestID);
            expect(newTotalBudget).toEqual(currentTotalBudget + 100000)
            budgetPage.deleteBudget(await budgetPage.getBudgetCardDeleteSelector('Transport'));
            await budgetPage.waitForToast('Budget deleted successfully')
            expect(await budgetPage.isAvailable(await budgetPage.getBudgetCardSelector('Transport'))).toBe(false);

            const totalBudget = await budgetPage.getSummaryBoxValue(budgetPage.totalBudgetTestID);
            expect(totalBudget).toEqual(currentTotalBudget);

            await budgetPage.deleteBudgetIfExists("Transport")
        });
    });

});