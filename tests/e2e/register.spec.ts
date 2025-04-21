// tests/register.spec.ts
import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';

test.describe('Registration Page', () => {
    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
    });

    test.describe('1.1 - Navigation Tests', () => {
        test('1.1.1 - Navigate from login to register page', async () => {
            await registerPage.navigateFromLoginPage();
            expect(await registerPage.isRegisterFormDisplayed()).toBe(true);
        });

        test('1.1.2 - Verify all form fields are rendered', async () => {
            await registerPage.navigateToRegisterPage();
            expect(await registerPage.areAllFormFieldsDisplayed()).toBe(true);
        });
    });

    test.describe('1.2 - Input Field Tests', () => {
        test('1.2.1 - Verify user can type in all fields', async () => {
            await registerPage.navigateToRegisterPage();

            const testData = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'securePassword123',
                confirmPassword: 'securePassword123'
            };

            await registerPage.fillRegisterForm(testData);

            expect(await registerPage.page.inputValue(registerPage.nameInputSelector)).toBe(testData.name);
            expect(await registerPage.page.inputValue(registerPage.emailInputSelector)).toBe(testData.email);
            expect(await registerPage.page.inputValue(registerPage.passwordInputSelector)).not.toBe('');
            expect(await registerPage.page.inputValue(registerPage.confirmPasswordInputSelector)).not.toBe('');
        });
    });

    test.describe('1.3 - Validation Tests', () => {
        test('1.3.1 - Verify error messages appear when form fields are left empty', async () => {
            await registerPage.navigateToRegisterPage();

            await registerPage.submitRegisterForm();

            expect(await registerPage.page.textContent('form')).toContain('Name must be at least 2 characters');
            expect(await registerPage.page.textContent('form')).toContain('Invalid email address');
            expect(await registerPage.page.textContent('form')).toContain('Password must be at least 6 characters');
            expect(await registerPage.page.textContent('form')).toContain('Password confirmation is required');
        });

        test('1.3.2 - Verify passwords do not match error', async () => {
            await registerPage.navigateToRegisterPage();

            const testData = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                confirmPassword: 'password456'
            };

            await registerPage.fillRegisterForm(testData);
            await registerPage.submitRegisterForm();

            expect(await registerPage.page.textContent('form')).toContain('Passwords do not match');
        });
    });

    test.describe('1.4 - Successful Registration Tests', () => {
        test('1.4.1 - Verify successful registration with valid data', async () => {
            await registerPage.navigateToRegisterPage();

            const testData = {
                name: `John Doe ${Date.now()}`,
                email: `john.doe.${Date.now()}@example.com`,
                password: 'securePassword123',
                confirmPassword: 'securePassword123'
            };

            await registerPage.registerNewUser(testData);

            expect(await registerPage.checkToastMessage('Registration successful! Please log in.')).toBe(true);

            expect(await registerPage.isRedirectedToLoginPage()).toBe(true);
        });
    });

    test.describe('1.5 - Duplicate Email Tests', () => {
        test('1.5.1 - Verify user cannot register with already registered email', async () => {
            await registerPage.navigateToRegisterPage();

            const testData = {
                name: 'John Doe',
                email: 'already.registered@example.com',
                password: 'securePassword123',
                confirmPassword: 'securePassword123'
            };

            await registerPage.registerNewUser(testData);

            expect(await registerPage.checkToastMessage('User already exists')).toBe(true);
        });
    });

    test.describe('1.6 - Invalid Input Tests', () => {
        test('1.6.1 - Verify user cannot register with invalid email format', async () => {
            await registerPage.navigateToRegisterPage();

            const testData = {
                name: 'John Doe',
                email: 'invalid-email-format',
                password: 'securePassword123',
                confirmPassword: 'securePassword123'
            };

            await registerPage.fillRegisterForm(testData);
            await registerPage.submitRegisterForm();

            expect(await registerPage.page.textContent('form')).toContain('Invalid email address');
        });

        test('1.6.2 - Verify error message when using a password with too few characters', async () => {
            await registerPage.navigateToRegisterPage();

            const testData = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'short',
                confirmPassword: 'short'
            };

            await registerPage.fillRegisterForm(testData);
            await registerPage.submitRegisterForm();

            expect(await registerPage.page.textContent('form')).toContain('Password must be at least 6 characters');
        });
    });
});