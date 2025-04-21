// tests/pages/registerPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class RegisterPage extends BasePage {
    // Selectors
    readonly nameInputSelector = 'input[name="name"]';
    readonly emailInputSelector = 'input[name="email"]';
    readonly passwordInputSelector = 'input[name="password"]';
    readonly confirmPasswordInputSelector = 'input[name="confirmPassword"]';
    readonly registerButtonSelector = 'button[type="submit"]';
    readonly loginLinkSelector = 'a[href="/login"]';
    readonly formSelector = 'form';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to register page
     */
    async navigateToRegisterPage() {
        await this.navigate('/register');
        await this.waitForNetwork();
    }

    /**
     * Navigate from login to register page
     */
    async navigateFromLoginPage() {
        await this.navigate('/login');
        await this.waitForNetwork();

        // Find the link that points to the register page
        // This might differ based on your actual UI
        await this.page.click('a[href="/register"]');
        await this.waitForNetwork();
    }

    /**
     * Check if register form is displayed
     */
    async isRegisterFormDisplayed() {
        return await this.isVisible(this.formSelector);
    }

    /**
     * Check if all form fields are displayed
     */
    async areAllFormFieldsDisplayed() {
        const nameVisible = await this.isVisible(this.nameInputSelector);
        const emailVisible = await this.isVisible(this.emailInputSelector);
        const passwordVisible = await this.isVisible(this.passwordInputSelector);
        const confirmPasswordVisible = await this.isVisible(this.confirmPasswordInputSelector);
        const registerButtonVisible = await this.isVisible(this.registerButtonSelector);

        return nameVisible && emailVisible && passwordVisible && confirmPasswordVisible && registerButtonVisible;
    }

    /**
     * Fill register form
     */
    async fillRegisterForm({
        name,
        email,
        password,
        confirmPassword
    }: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) {
        await this.fillInput(this.nameInputSelector, name);
        await this.fillInput(this.emailInputSelector, email);
        await this.fillInput(this.passwordInputSelector, password);
        await this.fillInput(this.confirmPasswordInputSelector, confirmPassword);
    }

    /**
     * Submit register form
     */
    async submitRegisterForm() {
        await this.clickElement(this.registerButtonSelector);
    }

    /**
     * Register new user
     */
    async registerNewUser({
        name,
        email,
        password,
        confirmPassword = password
    }: {
        name: string;
        email: string;
        password: string;
        confirmPassword?: string;
    }) {
        await this.fillRegisterForm({ name, email, password, confirmPassword });
        await this.submitRegisterForm();
    }

    /**
     * Check if validation error exists
     */
    async getValidationError(fieldName: string) {
        const errorSelector = `text=/.*${fieldName}.*/i`;
        return await this.page.textContent(errorSelector);
    }

    /**
     * Check for toast message
     */
    async checkToastMessage(text: string) {
        await this.waitForToast(text);
        const toastContent = await this.page.textContent(`text=${text}`);
        return toastContent?.includes(text);
    }

    /**
     * Check if redirected to login page
     */
    async isRedirectedToLoginPage() {
        await this.page.waitForURL('**/login');
        return this.page.url().includes('/login');
    }
}