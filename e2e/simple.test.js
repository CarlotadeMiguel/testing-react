const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

describe('Ejemplo simple de Selenium con Jest', () => {
  let driver;

  beforeAll(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path);
    const args = ['--window-size=1920,1080']
    // Configuración específica para CI vs local
    if (process.env.CI || process.platform !== 'win32') {
      args.push('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu')
    } else {
      // local Windows
      args.push('--headless=new','--disable-gpu')
    }
    const options = new chrome.Options().addArguments(...args)
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
