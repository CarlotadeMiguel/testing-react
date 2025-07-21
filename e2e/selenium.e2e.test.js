// e2e/selenium.e2e.test.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

describe('Validación básica de login con Selenium', () => {
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
      // NO user-data-dir en CI
    } else {
      options.addArguments('--user-data-dir=./chrome-user-data');
    }
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  }, 30000);
  
  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });
  
  test('debe mostrar título y rechazar login incorrecto', async () => {
    await driver.get('http://localhost:5173');
    
    // Espera el título
    const title = await driver.wait(
      until.elementLocated(By.css('h1')), 
      10000
    );
    const titleText = await title.getText();
    expect(titleText).toMatch(/iniciar sesión/i);
    
    // Test de login incorrecto
    const emailInput = await driver.findElement(By.name('email'));
    const passwordInput = await driver.findElement(By.name('password'));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    
    await emailInput.sendKeys('wrong@email.com');
    await passwordInput.sendKeys('wrongpassword');
    await submitBtn.click();
    
    // Espera mensaje de error
    const errorMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'incorrectas') or contains(text(),'error')]")),
      5000
    );
    expect(await errorMsg.getText()).toBeTruthy();
  }, 25000);
});
