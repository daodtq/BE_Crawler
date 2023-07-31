const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    url: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    let lateUrl;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(inputs.url);

    const ReCaptcha = async () => {
      let data = "";
      const image = await page.$eval("img", (el) => el.src);
      await Tesseract.recognize(image, "eng", {}).then(
        async ({ data: { text } }) => {
          await page.evaluate(
            (val) => (document.querySelector("#captchacharacters").value = val),
            text.toUpperCase()
          );
          await page.click('button[type="submit"]');
          await page.waitForNavigation();
          data = await page.url();
        }
      );

      return data;
    };
    const captcha = await page.$("#captchacharacters");
    if (captcha) {
      for (let i = 0; i < 2; i++) {
        console.log("==>>Start Find Captcha!!");
        lateUrl = await ReCaptcha();
        if (!lateUrl.includes("errors")) {
          console.log("==>>End Find Captcha!!");
          break;
        } else {
          i--;
        }
      }
    }
    const options = [];
    const variation_style_name = await page.$$(".variation_style_name > ul");
    for (style_name of variation_style_name) {
      options.push(await swatch.evaluate((el) => el.textContent));
    }

    // const swatchSelect = await page.$$(
    //   ".swatchSelect > span > div > span > span > span > button > div > div > p"
    // );
    // const swatchAvailable = await page.$$(
    //   ".swatchAvailable > span > div > span > span > span > button > div > div > p"
    // );

    // for (swatch of swatchSelect) {
    //   options.push(await swatch.evaluate((el) => el.textContent));
    // }

    // for (swatch of swatchAvailable) {
    //   options.push(await swatch.evaluate((el) => el.textContent));
    // }

    const elementTitle = await page.waitForSelector("#productTitle");

    const title = await elementTitle.evaluate((el) => el.textContent);
    console.log(title);

    return exits.success(options);
  },
};
