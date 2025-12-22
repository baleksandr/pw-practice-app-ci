import { Page } from "@playwright/test";
import {NavigationPage} from '../page-objects/navigationPage' //зробили імпорт цієї навігаційної сторінки в цей файл з назвою класа
import {FormLayoutsPage} from '../page-objects/formLayoutPage'
import {DatepickerPage} from '..//page-objects/datepickerPage'

export class PageManager {

    private readonly page: Page
    private readonly navigationPage: NavigationPage //присвоювати ці екземпляри полям
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datepickerPage: DatepickerPage

    constructor(page: Page) { //ініціалізувати конструктор, який буде створювати екземпляри ваших сторінок
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datepickerPage = new DatepickerPage(this.page)
    }

    navigateTo(){ //створити окремі методи, які повертатимуть вам цей екземпляр
        return this.navigationPage
    }

    onFormLayoutsPage(){
        return this.formLayoutsPage
    }

    onDatepickerPage(){
        return this.datepickerPage
    }

}