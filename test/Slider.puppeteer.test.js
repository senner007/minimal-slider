const puppeteer = require('puppeteer');

test('ul innerWidth and outerWidth', async () => {

  jest.setTimeout(30000);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 1600,
    height: 1000
  })
  await page.goto('http://localhost:1234');

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
      ulInnerWidth: document.querySelector('.margin-border li').clientWidth,
      ulOuterWidth: document.querySelector('.margin-border li').offsetWidth

    };
  });

  await browser.close();

  var totalWidth = dimensions.width / 2 * 0.7;
  var margins = 30;
  var borders = 4;

  expect(dimensions.ulInnerWidth).toBe(totalWidth - margins - borders);
  expect(dimensions.ulOuterWidth).toBe(totalWidth - margins);

});