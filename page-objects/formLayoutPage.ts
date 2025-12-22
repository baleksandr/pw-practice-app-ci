import {Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase{

    // readonly page: Page //створили  поля

    constructor(page: Page) { //створили конструктор 
        super(page)
    }

    async submitUsingTheGrigdFormWithCredentialsAndSelectOption(email: string, password: string, optionTaxt: string) {
        const usingTheGridForm = this.page.locator('nb-card', {hasText: 'Using the Grid'})
        await usingTheGridForm.getByRole('textbox', {name: 'Email'}).fill(email)
        await usingTheGridForm.getByRole('textbox', {name: 'Password'}).fill(password)
        await usingTheGridForm.getByRole('radio', {name: optionTaxt}).check({force: true})
        await usingTheGridForm.getByRole('button').click()
    }

    /**
     * This method will out the Inline form with user detaols
     * @param name - should be first and last name 
     * @param email - valid email for the test user
     * @param rememberMe - true or false if user sassion be saved 
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
        const inlineform = this.page.locator('nb-card', {hasText: 'Inline form'})
        await inlineform.getByRole('textbox', {name: 'Jane Doe'}).fill(name)
        await inlineform.getByRole('textbox', {name: 'Email'}).fill(email)

        if(rememberMe) 
            await inlineform.getByRole('checkbox').check({force: true})
        await inlineform.getByRole('button').click()
    }

}