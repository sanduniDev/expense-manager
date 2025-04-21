import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Login Page', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
    });
    test.describe('1.1 - Navigation Tests', () => {
        test('1.1.1 - Navigate to login page', async ({ page }) => {
            const titleContent = await page.getByText('Login');
            expect(titleContent).toBeTruthy();
        });
        test('1.1.2 - Verify all form fields are rendered correctly', async () => {
            const areAllElementsVisible = await loginPage.verifyLoginFormElements();
            expect(areAllElementsVisible).toBeTruthy();
        });
    });

    test.describe('1.2 - Input Field Tests', () => {
        test('1.2.1 - Verify user can type in email and password fields', async ({ page }) => {
            const testEmail = 'test@example.com';
            const testPassword = 'password123';

            await loginPage.fillLoginForm(testEmail, testPassword);

            const emailValue = await page.inputValue(loginPage.emailInputSelector);
            const passwordValue = await page.inputValue(loginPage.passwordInputSelector);

            expect(emailValue).toBe(testEmail);
            expect(passwordValue).toBe(testPassword);
        });
    });

    test.describe('1.3 - Validation Tests', () => {
        test('1.3.1 - Verify error messages appear when form fields are left empty', async ({ page }) => {
            await loginPage.submitLoginForm();

            const emailErrorVisible = await page.isVisible('text=Invalid email address');
            expect(emailErrorVisible).toBeTruthy();
        });

        test('1.3.2 - Verify error message for invalid email format', async ({ page }) => {
            await loginPage.fillLoginForm('invalid-email', 'password123');
            await loginPage.submitLoginForm();

            const emailErrorVisible = await page.isVisible('text=Invalid email address');
            expect(emailErrorVisible).toBeTruthy();
        });

        test('1.3.3 - Verify error message for password with too few characters', async ({ page }) => {
            await loginPage.fillLoginForm('test@example.com', '12345');
            await loginPage.submitLoginForm();

            const passwordErrorVisible = await page.isVisible('text=Password must be at least 6 characters');
            expect(passwordErrorVisible).toBeTruthy();
        });
    });

    test.describe('1.4 - Authentication Tests', () => {
        test('1.4.1 - Verify successful login with valid credentials', async ({ page }) => {
            await loginPage.login('already.registered@example.com', 'securePassword123');

            await page.waitForURL('**/dashboard');
            expect(page.url()).toContain('/dashboard');
        });
        test('1.4.2 - Verify error message for invalid credentials', async () => {
            await loginPage.login('invalid@example.com', 'invalidpassword');

            const toast = await loginPage.checkToastMessage("Invalid credentials. Please try again.");
            expect(toast).toBeTruthy();
        });
    });

});