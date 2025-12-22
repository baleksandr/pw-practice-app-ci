import {expect, test} from '@playwright/test'
import { timeout } from 'rxjs';

test.beforeEach(async({page}, testInfo) => {
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
    testInfo.setTimeout(testInfo.timeout + 2000) // Extend timeout for all tests running this hook by 2 seconds.
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    // await successButton.click()

    // const text = await successButton.textContent()

    // await successButton.waitFor({state: 'attached'})
    // const text = await successButton.allTextContents()

    // expect(text).toContain('Data loaded with AJAX get request.')

    //Adding timout {timeout: 20000} for await which have timeout for waiting only 5sec
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test.skip('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    //#1 wait for element
    // await page.waitForSelector('.bg-success')

    //#2 wait for particular response
    // await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata')

    //#3 wait for network calls to be complited ('NOT RECOMENDED')
    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip('timeouts', async({page}) => {
    test.setTimeout(10000) //Changing test timeout.
    test.slow() // Marks a test as "slow". Slow test will be given triple the default timeout.
    const successButton = page.locator('.bg-success')
    await successButton.click()
})