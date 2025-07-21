const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

describe('Ejemplo simple de Selenium con Jest', () => {
  let driver;

  beforeAll(async () => {
    const service = new chrome.ServiceBuilder(chromedriver.path);
    const options = new chrome.Options();
    
    // Configuración específica para CI vs local
    if (process.env.CI === 'true') {
      options.addArguments('--headless');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-gpu');
      options.addArguments('--window-size=1920,1080');
    } else {
      // Directorio único para evitar conflictos locales
      options.addArguments(`--user-data-dir=./chrome-user-data-${Date.now()}`);
    }
    
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
