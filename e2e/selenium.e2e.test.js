const {Builder, By, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:3000');
    let el = await driver.wait(until.elementLocated(By.css('h1')), 10000);
    let text = await el.getText();
    if (!/iniciar sesión/i.test(text)) throw new Error('No se encontró el heading');
  } finally {
    await driver.quit();
  }
})();
