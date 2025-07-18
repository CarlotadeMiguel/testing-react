const { Builder, By, until } = require('selenium-webdriver');

test('Validación básica de login con Selenium', async () => {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:3000');
    let el = await driver.wait(until.elementLocated(By.css('h1')), 10000);
    let text = await el.getText();
    expect(/iniciar sesión/i.test(text)).toBeTruthy();

    // Comprueba inputs y botón submit
    let inputEmail = await driver.findElement(By.name('email'));
    let inputPass  = await driver.findElement(By.name('password'));
    let btnLogin   = await driver.findElement(By.css('button[type="submit"]'));

    // Prueba un login incorrecto (ajustar según respuesta de tu app)
    await inputEmail.sendKeys('fail@test.com');
    await inputPass.sendKeys('badpass');
    await btnLogin.click();

    // Espera mensaje de error típico (ajustar selector/texto según tu app)
    let errorMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'incorrectas')]")),
      5000
    );
    expect(await errorMsg.getText()).toMatch(/incorrectas/i);

  } finally {
    await driver.quit();
  }
}, 20000); // 20 segundos de timeout por si Selenium va lento
