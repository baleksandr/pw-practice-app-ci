import {expect, test} from '@playwright/test'
import { log } from 'console';

test.describe.configure({mode: 'parallel'}) //паралельному режимі ви можете вказати режим конфігурації

test.beforeEach(async({page}) => {
    await page.goto('/');
})

test.describe('Form Layouts page @block', () => {
    // test.describe.configure({retries: 2}) // запускає тест на retry 2 рази - перевизначити цей лічильник в (playwright.config.ts -  retries: process.env.CI ? 2 : 1,)
    // test.describe.configure({mode: 'serial'}) //налаштувати запуск тесту у послідовному режимі - якщо у вас є залежність тесту, і ви хочете, щоб залежний тест пропускався, якщо попередній тест не пройшов

    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

    test('input fields', async({page}, testInfo) => {
        if(testInfo.retry) {
            //o something
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'})

        await usingTheGridEmailInput.fill('aleks@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('aleks@test.com', {delay: 500}) // Types slower, like a user

        //general assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('aleks@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('aleks@test.com') //Ensures the Locator points to an element with the given input value.
    })

    test.only('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the Grid'})

        // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true}) // Select to the RadioButton use method -> check()
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked() // .isChecked() return boolean value

        // await expect(usingTheGridForm).toHaveScreenshot() // проапдейтити всі знімки екрана до нової базової лінії -> npx playwright test --update-snapshots

        // general assertion
        expect(radioStatus).toBeTruthy() //Ensures that value is true in a boolean context, anything but false, 0, '', null, undefined or NaN.
        // locator assertion
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked() //LocatorAssertions - Ensures the Locator points to a checked input.

        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy() //.toBeFalsy() -> GenericAssertions (Ensures that value is false in a boolean context, one of false, 0, '', null, undefined or NaN)
        expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
    })
})


test('checkboxes', async ({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    // await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true}) //.click only click the 'checkbox' and not check to the status of the checkbox 
    // await page.getByRole('checkbox', {name: 'Hide on click'}).check({force: true}) //.check -> Ensure that checkbox or radio element is checked - BUT if checkbox ON .check NOt click it again
    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true}) //.uncheck -> Ensure that checkbox or radio element is unchecked.- BUT if checkbox ON .uncheck click it again to remove checkbox
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true}) 

    // Turn ON/OFF all checkboxes
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        //turned ON
        // await box.check({force: true}) // current checkbox is turned ON 
        // expect(await box.isChecked()).toBeTruthy() //check the current checkbox return 'true'

        //turned OFF 
        await box.uncheck({force: true}) // current checkbox is turned OFF 
        expect(await box.isChecked()).toBeFalsy() //check the current checkbox return 'false'
    }
}) 

test('list and dropdowns', async ({page}) => {
    const dropdownManu = await page.locator('ngx-header nb-select')
    await dropdownManu.click()

    page.getByRole('list') //when the list has a <ul> tag
    page.getByRole('listitem')//when the list has a <li> tag

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: 'Cosmic'}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": 'rgb(255, 255, 255)',
        "Dark": 'rgb(34, 43, 69)',
        "Cosmic": 'rgb(50, 50, 89)',
        "Corporate": 'rgb(255, 255, 255)'
    }

    // Loop to check all changes color from dropdownManu
    await dropdownManu.click()
    for (const color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropdownManu.click()
    }
})

test('tooltips', async ({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const tooltipField = page.locator('nb-tooltip')

    const tooltipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await tooltipCard.getByRole('button', {name: 'Top'}).hover() //Hover over the matching element.

    // page.getByRole('tooltip') // if you have a role tooltip created

    //general assertion
    const tooltip = await tooltipField.textContent()
    expect(tooltip).toEqual('This is a tooltip')

    //locator assertion
    await expect(tooltipField).toHaveText('This is a tooltip')
})  

//Alert pop-up brauser dialox box
test('dialog block', async({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //Click in a Accept button (OK) on a system Alert pop-up 
    page.on('dialog', dialog => { //'.on' -> Emitted when a JavaScript dialog appears, such as alert, prompt, confirm or beforeunload
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.eva-trash-2-outline').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // 1st example - get the row by any test in the row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
    await targetRow.locator('.eva-edit-outline').click()

    // await page.locator('input-editor').getByPlaceholder('Age').clear()
    // await page.locator('input-editor').getByPlaceholder('Age').fill('23')

    const ageInput = targetRow.locator("input").nth(5) // use .last() or .nth(5) - 6-те поле (Age - індекс 5)
    await ageInput.clear()
    await ageInput.fill('23')
    await targetRow.locator('.eva-checkmark-outline').click()

    //2nd example - get the row based on the value in the specific column
    await page.locator('.pagination-container').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.eva-edit-outline').click()

    const emailCell = page.getByRole('row', {name: '11'}).locator('input').nth(4);
    await emailCell.clear()
    await emailCell.fill('Aleks@outlook.com')
    await page.locator('.eva-checkmark-outline').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('Aleks@outlook.com')

    //3nd example - test filter of the tabel 
    const ages = ["20", "30", "40", "200"]

    for (const age of ages) {
        await page.locator('.filter-row').getByPlaceholder('Search Age').clear()
        await page.locator('.filter-row').getByPlaceholder('Search Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')
        
        for (const row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            console.log("cellValue1:", cellValue);

            if(cellValue == "No data found") {
                //general assertion
                // const tooltip = await page.locator('.no-data-message').textContent()
                console.log("cellValue2:", cellValue);
                expect(cellValue).toEqual('No data found')

                //locator assertion
                await expect(page.locator('.no-data-cell')).toHaveText('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const celendarInputField = page.getByPlaceholder('Form Picker')
    await celendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 7)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})

    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
    
    while(!calendarMonthAndYear.includes(expectMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
    

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(celendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page}) => {
    //Update slider atrbute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '232.630')
    //     node.setAttribute('cy', '232.630')
    // })
    // await tempGauge.click() // викликати подію щоб викликати внесення змін

    //Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded() // Скрол екрана до поточного поля повного його відображення

    const box = await tempBox.boundingBox() // Визначення обмежувальну рамку з якої почати рухати мишку(верхній лівий кут)
    const x = box.x + box.width / 2 // Знаходимо центер tempBox
    const y = box.y + box.height / 2 // Знаходимо центер tempBox
    await page.mouse.move(x, y) // Рухаємо мишку по коодинатам
    await page.mouse.down() //Натискаємо мишку на початкову точку, сімуляція натискання лівої кнопки мищі
    await page.mouse.move(x + 100, y) // рухаємо мишку праворуч
    await page.mouse.move(x + 100, y + 100) // рухаємо мишку праворуч і вниз
    await page.mouse.up() // відпускає мишку

    await expect(tempBox).toContainText('30')
})