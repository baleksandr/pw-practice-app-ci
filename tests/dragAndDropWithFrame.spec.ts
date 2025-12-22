import {expect} from '@playwright/test'
import {test} from '../test-option'

test('drag an ddrop with frame', async({page, globalsQaURL}) =>{
    await page.goto(globalsQaURL);

    //page.frameLocator() -> key to iframe - When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements in that iframe.
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe') 
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

    //more precise control
    await frame.locator('li', {hasText: "High Tatras 4"}).hover() //Hover over the matching element.
    await page.mouse.down() //Натискаємо мишку на початкову точку, сімуляція натискання лівої кнопки мищі
    await frame.locator('#trash').hover()
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
    await page.waitForTimeout(500)

    // const recycleImage = frame.locator('#trash ul li',  {hasText: "High Tatras 4"})
    // await recycleImage.getByText('Recycle image').click()

    // await page.waitForTimeout(500)
    // await frame.locator('#trash ul li',  {hasText: "High Tatras 2"}).hover()
    // await page.mouse.down()
    // await frame.locator('#gallery').hover()
    // await page.mouse.up()

    const recycleImages = frame.locator('#trash ul li')

    for (const recycleImag of await recycleImages.all()) {
        //Click on a Recycle button
        await recycleImag.getByText('Recycle image').first().click()

        //drag an ddrop images from the Trash bin
        // await recycleImag.locator('img').first().hover()
        // await page.mouse.down()
        // await frame.locator('#gallery').hover()
        // await page.mouse.up()

    }
    await expect(frame.locator('#trash li h5')).not.toHaveText(["High Tatras 2", "High Tatras 4"])
})