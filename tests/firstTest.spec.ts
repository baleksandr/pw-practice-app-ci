import {expect, test} from '@playwright/test'
//npm start - запустити проект на прорту     baseURL: 'http://localhost:4201/',
//npx playwright test --ui //запустити ui сторынку з проектом - де можно виьрати енви для зпуску

test.beforeEach(async({page}) => {
    await page.goto('/');
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
})


test('Locator syntax rules', async({page}) => {
    // by Tag name
   await page.locator('input').first().click()

    //by ID
    page.locator('#inputEmail1')

    //by class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different combination selectors 
    page.locator('input[placeholder="Email"][nbinput]')

    //by XPath (NOT RECOMENDED)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exzct text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
   await page.getByRole('textbox', {name: "Email"}).first().click();
   await page.getByRole('button', {name: "Sign in"}).first().click();

   await page.getByLabel('Email').first().click();

   await page.getByPlaceholder('Jane Doe').click();

   await page.getByText('Using the Grid').click();

//    await page.getByTitle('IoT Dashboard').click()

   await page.getByTestId('SignIn').click()
})

test('locating child elemtnts', async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locaating parent elements', async({page}) => {
    //filter by text locator method
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    //filter by locaator ID
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'})
        .getByRole('button', {name: "Sign in"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Password"}).click()
})

test('Reusing the locators', async({page}) =>{
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    const passwordField = basicForm.getByRole('textbox', {name: "Password"})

    await emailField.fill('aleks@test.com')
    await passwordField.fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('aleks@test.com')
    await expect(passwordField).toHaveValue('Welcome123')
})

test('Extracing value', async({page}) => {
    //Single value
    const basicForm = page.locator('nb-card').filter({hasText: 'Basic form'})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text value
    const allRedioButtonsLables = await page.locator('nb-radio').allTextContents()
    expect(allRedioButtonsLables).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('aleks@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('aleks@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('Assertions', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: 'Basic form'}).locator('button')
    //Ganeral Assertions
    const value = 5
    expect(value).toEqual(5)

    const buttonText = await basicFormButton.textContent()
    expect(buttonText).toEqual('Submit')

    //Locator Assertions
    await expect(basicFormButton).toHaveText('Submit')

    //Soft Assertions
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})