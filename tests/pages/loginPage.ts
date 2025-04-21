// tests/pages/loginPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
    // Selectors
    readonly emailInputSelector = 'input[name="email"]';
    readonly passwordInputSelector = 'input[name="password"]';
    readonly signInButtonSelector = 'button[type="submit"]';
    readonly registerLinkSelector = 'a[href="/register"]';
    readonly formErrorSelector = '.text-destructive';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to login page
     */
    async navigateToLoginPage() {
        await this.navigate('/');
    }

    /**
     * Fill login form
     */
    async fillLoginForm(email: string, password: string) {
        await this.fillInput(this.emailInputSelector, email);
        await this.fillInput(this.passwordInputSelector, password);
    }

    /**
     * Submit login form
     */
    async submitLoginForm() {
        await this.clickElement(this.signInButtonSelector);
    }

    /**
     * Login with credentials
     */
    async login(email: string, password: string) {
        await this.fillLoginForm(email, password);
        await this.submitLoginForm();
    }

    /**
     * Click on register link
     */
    async clickRegisterLink() {
        await this.clickElement(this.registerLinkSelector);
    }

    /**
     * Get form error message
     */
    async getFormErrorMessage() {
        return await this.getText(this.formErrorSelector);
    }

    /**
     * Check if form error message is visible
     */
    async isFormErrorVisible() {
        const errorSelector = `text=/.*$Invalid credentials. Please try again..*/i`;
        return await this.page.textContent(errorSelector);
    }

    /**
     * Verify all login form elements are visible
     */
    async verifyLoginFormElements() {
        const isEmailInputVisible = await this.isVisible(this.emailInputSelector);
        const isPasswordInputVisible = await this.isVisible(this.passwordInputSelector);
        const isSignInButtonVisible = await this.isVisible(this.signInButtonSelector);
        const isRegisterLinkVisible = await this.isVisible(this.registerLinkSelector);

        return (
            isEmailInputVisible &&
            isPasswordInputVisible &&
            isSignInButtonVisible &&
            isRegisterLinkVisible
        );
    }
}