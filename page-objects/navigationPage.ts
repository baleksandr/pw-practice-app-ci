import {Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{ //створили класс з експортом, щоб його можно було імпортувати
//- Виклик конструктора батька HelperBase. Коли клас наслідує (extends), частина об’єкта належить батьківському класу; super(...) 
// викликає його конструктор і встановлює ці поля та внутрішній стан, які потрібні до подальшої роботи дочірнього конструктора.

    // readonly page: Page //створили  поля
    // readonly formLayoutMenuItem: Locator 

    constructor(page: Page) { //створили конструктор 
        super(page) // Виклик конструктора батька HelperBase.constructor
        // this.formLayoutMenuItem = page.getByText('Form Layouts')
    }

    async formLayoutsPage() { //створили метод 
        await this.selectGroupeMenuItem('Forms')
        await this.page.getByText('Form Layouts').click();
        await this.waitForNumberOfSeconds(2)
        // await this.formLayoutMenuItem.click();
    }

    async datePickerPage () {
        await this.selectGroupeMenuItem('Forms')
        await this.page.getByText('Datepicker').click();
    }

    async smartTablePage () {
        await this.selectGroupeMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click();
    }
        
    async toastrPage () {
        await this.selectGroupeMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click();
    }

    async tooltiPage () {
        await this.selectGroupeMenuItem('Modal & Overlays')
        await this.page.getByText('Tooltip').click();
    }

    private async selectGroupeMenuItem(groupItemTitle: string) { //створили внутрішній метод, який буде перевіряти стан головного меню.Він розширений чи згорнутий?
        const hroupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await hroupMenuItem.getAttribute('aria-expanded')

        if(expandedState == 'false') {
            await hroupMenuItem.click()
        }
    }
}