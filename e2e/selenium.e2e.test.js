const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

describe('Login Selenium', () => {
    let driver;

    beforeAll(async () => {
        const service = new chrome.ServiceBuilder(chromedriver.path);
        const options = new chrome.Options()
            .addArguments('--headless=new')
            .addArguments('--disable-gpu')
            .addArguments('--no-sandbox')
            .addArguments('--disable-dev-shm-usage')
            .addArguments('--window-size=1920,1080');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)
            .build();
    }, 30000);

    afterAll(async () => {
        if (driver) await driver.quit();
    });

    test('debe mostrar título y rechazar login incorrecto', async () => {
        // 1. Abre la aplicación
        await driver.get('http://localhost:5173');

        // 2. Espera a que no exista el overlay de error de Vite
        await driver.wait(async () => {
            const overlays = await driver.findElements(By.css('vite-error-overlay'));
            return overlays.length === 0;
        }, 5000);

        // 3. Pequeña pausa extra para asegurar estabilidad del DOM
        await driver.sleep(500);

        // 4. Ahora sí interactúa con el formulario
        const title = await driver.wait(until.elementLocated(By.css('h1')), 10000);
        expect(await title.getText()).toMatch(/iniciar sesión/i);

        const emailInput = await driver.findElement(By.name('email'));
        const passwordInput = await driver.findElement(By.name('password'));

        await emailInput.sendKeys('wrong@email.com');
        await passwordInput.sendKeys('wrongpassword');

        const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
        await submitBtn.click();

        const errorMsg = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'incorrectas') or contains(text(),'error')]")),
            8000
        );
        expect(await errorMsg.getText()).toBeTruthy();
    }, 30000);
});
