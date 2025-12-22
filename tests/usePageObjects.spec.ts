import {expect, test} from '@playwright/test'
import {PageManager} from '..//page-objects/pageManager'
import {faker} from '@faker-js/faker'
import { log } from 'console';
//docker build -t pw-playwright-test . - збирає докер файли для подальшого запуску. всі конфіги 
//docker run -it pw-playwright-test- запускає тест в докері 
//docker-compose up --build - запуск композиції налаштунка докера - пересбере білд і сам запустить

test.beforeEach(async({page}) => {
    await page.goto('/');
})
// запуск по тегам npx playwright test --project=chromium --grep @block
// якщо в різних папках і різні теги то npx playwright test --project=chromium --grep "@block|@smoke"
test('navigate to form page @smoke @regression' , async ({page}) => {
    const pm = new PageManager(page)
    // const navigateTo = new NavigationPage(page) // Створюємо новий екземпляр класу і через параметр new
    await pm.navigateTo().formLayoutsPage() //викликаємо метод з нашого об'єкта сторінки, використовуючи крапкову нотацію.
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltiPage()
})

test('parametrized methods @smoke' , async ({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(/\s+/g, '')}${faker.number.int(1000)}@test.com`

    // const navigateTo = new NavigationPage(page)
    // const onFormLayoutsPage = new FormLayoutsPage(page) // Створюємо новий екземпляр класу і через параметр new
    // const onDatepickerPage = new DatepickerPage(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGrigdFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2' ) //викликаємо метод з нашого об'єкта сторінки, використовуючи крапкову нотацію.
    await page.screenshot({path: 'screenshot/formsLayoutsPage.png'}) //Робить screenshot всієї сторінки
    // const buffer = await page.screenshot() // сбеоеження картинки в буфер
    // console.log(buffer.toString('base64')); // сбереження скріншота в бінарному коді для передачу в іншу систему 
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshot/Inlineform.png'}) // Робить screenshot конкретної області на сторінці по локатору 
    await pm.navigateTo().datePickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(25)
    await pm.onDatepickerPage().selectDatepickerWithTheCelender(23, 27)
})

test.only('testing with argos ci' , async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage() //викликаємо метод з нашого об'єкта сторінки, використовуючи крапкову нотацію.
    await pm.navigateTo().datePickerPage()
})