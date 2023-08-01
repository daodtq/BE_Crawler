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
    const _variations = [];

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
    for (form of await page.$$("#twister > div")) {
      const variation_name = await page.evaluate(
        (el) => el.getAttribute("id"),
        form
      );
      if (
        variation_name != "variation_service_provider" &&
        variation_name != "variation_product_grade"
      ) {
        _variations.push(variation_name);
      }
    }
    const list = [];

    const nameParent = await page.$$(`#${_variations[0]} > ul > li`);
    for (let j = 0; j < nameParent.length; j++) {
      const _name = await page.evaluate(
        (el) => el.getAttribute("id"),
        nameParent[j]
      );
      if (j != 0) {
        await page.click(`#${_name}`);
        await page.waitForNavigation({ waitUntil: "load" });
      }

      const name1 = await page.$$(`#${_name}`);
      const elTitle1 = await page.waitForSelector("#productTitle");
      const title1 = await page.evaluate(
        (el) => el.getAttribute("title"),
        name1[0]
      );
      const price1 = await page.$$(
        "#corePrice_feature_div > div > span > span"
      );

      if (_variations.length == 2) {
        const nameChild = await page.$$(`#${_variations[1]} > ul > li`);
        for (let i = 0; i < nameChild.length; i++) {
          const _nameChild = await page.evaluate(
            (el) => el.getAttribute("id"),
            nameChild[i]
          );

          if (
            (await page.evaluate(
              (el) => el.getAttribute("class"),
              nameChild[i]
            )) == "swatchUnavailable"
          ) {
            continue;
          }
          if (i != 0) {
            await page.click(`#${_nameChild}`);
            await page.waitForNavigation({ waitUntil: "load" });
          }
          const nameFirst = await page.$$(`#${_nameChild}`);
          const elTitle2 = await page.waitForSelector("#productTitle");
          const title2 = await page.evaluate(
            (el) => el.getAttribute("title"),
            nameFirst[0]
          );
          const price2 = await page.$$(
            "#corePrice_feature_div > div > span > span"
          );

          await page.waitForSelector(".imgTagWrapper");
          await page.click(".imgTagWrapper");
          await page.waitForSelector("#ivImage_0");
          await page.click("#ivImage_0");
          //ivLargeImage
          const image1 = await page.evaluate(
            (el) => el.getAttribute("src"),
            (
              await page.$$(`#ivLargeImage`)
            )[0]
          );
          await page.waitForSelector(".a-button-close");
          await page.click(".a-button-close");
          await page.waitForSelector("#productTitle");
          // await page.click("#ivImage_1");
          // await page.click("#ivImage_2");

          // for (image of images) {
          // }
          const info = {
            image1,
            [_name.replace("_name_", "")]: title1
              .toString()
              .replace("Click to select ", ""),
            [_nameChild.replace("_name_", "")]: title2
              .toString()
              .replace("Click to select ", ""),
            title: await elTitle2.evaluate((el) => el.textContent),
            price: price2.length
              ? await price2[0].evaluate((el) => el.textContent)
              : "Currently unavailable.",
          };
          list.push(info);
        }
      } else if (_variations.length == 1) {
        const info = {
          [_name.replace("_name_", "")]: title1
            .toString()
            .replace("Click to select ", ""),
          title: await elTitle1.evaluate((el) => el.textContent),
          price: await price1[0].evaluate((el) => el.textContent),
        };
        list.push(info);
      }
    }

    return exits.success(list);
  },
};
