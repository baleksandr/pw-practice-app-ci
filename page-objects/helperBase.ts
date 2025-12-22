import { Page } from "@playwright/test";

export class HelperBase { //створили класс з експортом, щоб його можно було імпортувати

    readonly page: Page //створили  поля

    constructor(page: Page) { //створили конструктор 
        this.page = page
    }

    async waitForNumberOfSeconds(timeInSeconds: number){
        await this.page.waitForTimeout(timeInSeconds * 1000)
    }
}