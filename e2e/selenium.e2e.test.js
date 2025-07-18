const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

const service = new chrome.ServiceBuilder(chromedriver.path); // quitar .build()
const options = new chrome.Options();

describe('Validación básica de login con Selenium', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)
            .build();
    }, 20000); // Puedes ajustar el timeout aquí

    afterAll(async () => {
        if (driver) await driver.quit();
    });

    test('debe mostrar título y rechazar login incorrecto', async () => {
        await driver.get('http://172.30.240.1:5173');

        // Espera y verifica el encabezado principal
        const el = await driver.wait(until.elementLocated(By.css('h1')), 10000);
        const text = await el.getText();
        expect(/Iniciar sesión/i.test(text)).toBeTruthy();

        // Encuentra los campos de login y botón
        const inputEmail = await driver.findElement(By.name('email'));
        const inputPass = await driver.findElement(By.name('password'));
        const btnLogin = await driver.findElement(By.css('button[type="submit"]'));

        // Intenta un login incorrecto
        await inputEmail.sendKeys('fail@test.com');
        await inputPass.sendKeys('badpass');
        await btnLogin.click();

        // Espera por el mensaje de error
        const errorMsg = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'8 caracteres')]")),
            5000
        );
        expect(await errorMsg.getText()).toMatch(/La contraseña debe tener al menos 8 caracteres/i);
    }, 20000); // Timeout individual del test
});
