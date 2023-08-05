const puppeteer = require("puppeteer");
var DomParser = require("dom-parser");
const Tesseract = require("tesseract.js");

const ReCaptcha = async (page) => {
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
    const data = [];
    let lateUrl;
    const url = "https://www.amazon.com";
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log(`${url}${inputs.url}&page=${1}`);
    const response = await fetch(`${url}${inputs.url}&page=${1}`, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "vi,en;q=0.9",
        "cache-control": "max-age=0",
        "device-memory": "8",
        downlink: "4.75",
        dpr: "0.8",
        ect: "4g",
        rtt: "100",
        "sec-ch-device-memory": "8",
        "sec-ch-dpr": "0.8",
        "sec-ch-ua":
          '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-ch-ua-platform-version": '"10.0.0"',
        "sec-ch-viewport-width": "1564",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "viewport-width": "1564",
        cookie:
          'csm-sid=256-7278430-6931411; x-amz-captcha-1=1690612378785909; x-amz-captcha-2=JIbL/EmDiwFPyBCbSxlTQw==; session-id=130-2376443-3547605; i18n-prefs=USD; sp-cdn="L5Z9:VN"; ubid-main=131-8528186-6264663; lc-main=en_US; AMCV_7742037254C95E840A4C98A6%40AdobeOrg=1585540135%7CMCIDTS%7C19570%7CMCMID%7C86242309421938575483650645528676100973%7CMCAAMLH-1691373870%7C3%7CMCAAMB-1691373870%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1690776270s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.0; regStatus=pre-register; aws-target-data=%7B%22support%22%3A%221%22%7D; aws-target-visitor-id=1690769423657-351964.38_0; session-id-time=2082787201l; skin=noskin; session-token=HzBcCd1sj3n+sS092dWt/mZKHuW3y0itKfkU8xa5z9Dxwt3tAQahLu4aQlO57jslPhKa6YHUhsP0TuzVGwULSJESmflE8/ANJ+nu5YHSQl6LR9CYuxmwFlNs4wrB16l2f9yPgQpU57MwZ3G6TPutHaokLfuq0gwfOzOqijh6Ayjm+V8miapvXy6iWoB3TuTkKqelqNf+M7X9d1mW+dLu0ywrDedRhqZ5ECidwNQ/7QM=; csm-hit=tb:M56A6WF9MCTCBGQJE336+s-94QNM6Z9G36W6S5YQYDR|1691203690127&t:1691203690127&adb:adblk_yes',
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
    });
    const text = await response.text();
    var parser = new DomParser();

    var dom = parser.parseFromString(text);
    for (res of dom.getElementsByClassName("s-widget-spacing-small")) {
      try {
        const _res = (await res.getElementsByTagName("a"))[0];
        const product_link = _res.getAttribute("href");
        await page.goto(`${url}${product_link}`);
        const captcha = await page.$("#captchacharacters");
        if (captcha) {
          for (let j = 0; j < 2; j++) {
            lateUrl = await ReCaptcha(page);
            if (!lateUrl.includes("errors")) {
              break;
            } else {
              j--;
            }
          }
        }
        const title = await (
          await page.waitForSelector(".productTitle")
        ).evaluate((el) => el.textContent);
        const price = await (
          await page.waitForSelector(".a-text-price")
        ).evaluate((el) => el.textContent);
        const _color = [];
        for (color of await page.$$(
          "#inline-twister-row-color_name > div > div > div > ul > li > span > span span > span > div > img"
        )) {
          _color.push(
            await page.evaluate((el) => el.getAttribute("alt"), color)
          );
        }
        console.log({ title, price, _color });
      } catch (error) {
        console.log(error);
      }
    }
    return exits.success(list);
  },
};
