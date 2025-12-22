import {test} from '..//test-option'
// import {PageManager} from '..//page-objects/pageManager'
import {faker} from '@faker-js/faker'
import { log } from 'console';

// test.beforeEach(async({page}) => {
//     await page.goto('/');
// })


test('parametrized methods' , async ({pageManager}) => {
    // const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(/\s+/g, '')}${faker.number.int(1000)}@test.com`

    // await pm.navigateTo().formLayoutsPage()
    await pageManager.onFormLayoutsPage().submitUsingTheGrigdFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2' ) //викликаємо метод з нашого об'єкта сторінки, використовуючи крапкову нотацію.
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})