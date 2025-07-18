const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

const service = new chrome.ServiceBuilder(chromedriver.path); // quitar .build()
const options = new chrome.Options();

describe('Ejemplo simple de Selenium con Jest', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  }, 20000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('debe abrir la página y verificar el título', async () => {
    await driver.get('https://www.selenium.dev/');
    const title = await driver.getTitle();
    expect(title).toMatch(/Selenium/i);
  });
});
