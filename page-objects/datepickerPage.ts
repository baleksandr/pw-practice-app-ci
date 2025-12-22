import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase{

    // readonly page: Page //створили  поля

    constructor(page: Page) { //створили конструктор 
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const celendarInputField = this.page.getByPlaceholder('Form Picker')
        await celendarInputField.click()

        const dateToAssert = await this.selectDateInTheCalender(numberOfDaysFromToday)
        await expect(celendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithTheCelender(startdatFromToday: number, endDayFromToday: number) {
        const celendarInputField = this.page.getByPlaceholder('Range Picker')
        await celendarInputField.click()

        const dateToAssertStart = await this.selectDateInTheCalender(startdatFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalender(endDayFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`

        await expect(celendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalender(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})

        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
        
        while(!calendarMonthAndYear.includes(expectMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()
        return dateToAssert
    }
}