const puppeteer = require("puppeteer");
var DomParser = require("dom-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "printerval.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "title", title: "Title" },
    { id: "url", title: "URL" },
    { id: "price", title: "Price" },
    { id: "src", title: "Src" },
    { id: "type", title: "Type" },
    { id: "style", title: "Style" },
    { id: "color", title: "Color" },
    { id: "size", title: "Size" },
  ],
});

const valid = ["Multiple selection", "Choose a size"];
module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    url: {
      type: "string",
    },
    quantity: {
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const url = "https://printerval.com";
    const data = [];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    for (let i = 0; i < inputs.quantity; i++) {
      try {
        const response = await fetch(`${url}${inputs.url}?page_id=${i}`, {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "vi,en;q=0.9",
            "cache-control": "max-age=0",
            "sec-ch-ua":
              '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            cookie:
              "_gcl_au=1.1.1524638740.1690937947; _ga=GA1.1.310692163.1690937947; ln_or=eyI1MDkzNTYyIjoiZCJ9; _pin_unauth=dWlkPU1UVTVNVE0yT0dZdE1qUTRaQzAwTnpOakxXRmpNalF0TnpWa05qRTFZalpsTkdZeg; _rdt_uuid=1690937947040.a93b0633-489c-4c20-b53f-f56255efe45e; _tt_enable_cookie=1; _ttp=4Kyc5puKKeUSnPshWa6WJWWr1rQ; fingerprint=L0uuCJFsMU1ehr9xbiBCvAMhMn8ElzJTVPuJR1f7; cjConsent=MHxOfDB8Tnww; cjLiveRampLastCall=2023-08-02T00:59:13.769Z; cjUser=444e156c%2Ddb6e%2D44b2%2Db989%2D9460eddd338e; _ga_5Q57T3BBYZ=GS1.1.1690937946.1.1.1690938022.0.0.0; _uetsid=c81126a030cf11ee943b3916b15eb702; _uetvid=c811504030cf11eeb83b937aeafaa4dd; __kla_id=eyIkcmVmZXJyZXIiOnsidHMiOjE2OTA5Mzc5NDcsInZhbHVlIjoiIiwiZmlyc3RfcGFnZSI6Imh0dHBzOi8vcHJpbnRlcnZhbC5jb20vIn0sIiRsYXN0X3JlZmVycmVyIjp7InRzIjoxNjkwOTM4MDIzLCJ2YWx1ZSI6IiIsImZpcnN0X3BhZ2UiOiJodHRwczovL3ByaW50ZXJ2YWwuY29tLyJ9fQ==; laravel_session=eyJpdiI6ImlSSzRWNUNDU3oyRnpFYzFcLytNVHdBPT0iLCJ2YWx1ZSI6IjBQNmFJelR2dlV5bzhPbkZKRnRWakZCWXpZcW91Qm1xb3lzMVdtUVY2SFhuOUJXMzhkUXAwcWs1TlVmT0doRjZJUHVvd2hRcjd6d2o1cDRpZDZGZ2JRPT0iLCJtYWMiOiIyZDk4ZWM3MWZmNjY3ZGMyNWQ2ZWJmMTAxMTA1Mzg1ZjU2OTg3NmJhY2QyNDdjYTFmMjM3MzdjYmJhNTJlOGYzIn0%3D",
            Referer: "https://printerval.com/clothing",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: null,
          method: "GET",
        });
        const text = await response.text();
        var parser = new DomParser();

        var dom = parser.parseFromString(text);

        for (res of dom.getElementsByClassName("product-link")) {
          try {
            const product_link = res.getAttribute("href");
            await page.goto(`${url}${product_link}`);
            const element = await page.waitForSelector(".js-product-name");
            const title = await element.evaluate((el) => el.textContent);

            await page.waitForSelector("#js-select-variant-1 > li");
            if ((await page.$$("#js-select-variant-5")).length) {
              for (type of await page.$$("#js-select-variant-5 > label")) {
                const _type = await page.evaluate(
                  (el) => el.getAttribute("data-variant-name"),
                  type
                );
                const price = await (
                  await page.$$(".product-price")
                )[0].evaluate((el) => el.textContent);
                const image = await page.$$(
                  ".product-gallery-item > picture > img"
                );
                const _image = await page.evaluate(
                  (el) => el.getAttribute("src"),
                  image[0]
                );
                if (_type == "Youth" || _type == "Kids") {
                  continue;
                }
                await page.$eval(
                  `label[data-variant-name='${_type}']`,
                  (elem) => elem.click()
                );
                const _style = await page.evaluate(
                  (el) => el.getAttribute("label"),
                  (
                    await page.$$("#js-select-variant-7 > option")
                  )[0]
                );
                const _styleValue = await page.evaluate(
                  (el) => el.getAttribute("value"),
                  (
                    await page.$$("#js-select-variant-7 > option")
                  )[0]
                );
                await page.select("#js-select-variant-7", _styleValue);

                let id = await page.evaluate(
                  (el) => el.getAttribute("value"),
                  (
                    await page.$$(".js-productSkuId")
                  )[0]
                );

                const list_color = [];
                const list_size = [];
                for (color of await page.$$("#js-select-variant-2 > div")) {
                  const _color = await page.evaluate(
                    (el) => el.getAttribute("title"),
                    color
                  );
                  list_color.push(_color);
                }
                for (size of await page.$$("#js-select-variant-1 > li")) {
                  let _size = (await size.evaluate((el) => el.textContent))
                    .replace(/\r?\n|\r/g, "")
                    .trim();
                  if (valid.includes(_size)) {
                    continue;
                  }
                  _size = _size.slice(0, _size.length - 8).trim();
                  list_size.push(_size);
                }
                data.push({
                  id,
                  price: price.replace(/\r?\n|\r/g, ""),
                  title: title.replace(/\r?\n|\r/g, ""),
                  url: `${url}${product_link}`,
                  src: _image,
                  style: _style.slice(0, _style.length - 8),
                  type: _type,
                  size: list_size.toString(),
                  color: list_color.toString(),
                });
              }
            } else {
              const list_size = [];
              await page.waitForSelector("#js-select-variant-1 > li");
              let id = await page.evaluate(
                (el) => el.getAttribute("value"),
                (
                  await page.$$(".js-productSkuId")
                )[0]
              );
              const image = await page.$$(
                ".product-gallery-item > picture > img"
              );
              const _image = await page.evaluate(
                (el) => el.getAttribute("src"),
                image[0]
              );
              for (size of await page.$$("#js-select-variant-1 > li")) {
                await page.evaluate(
                  (b) => b.click(),
                  (
                    await page.$$("#js-select-variant-1")
                  )[0]
                );
                let _size = (await size.evaluate((el) => el.textContent))
                  .replace(/\r?\n|\r/g, "")
                  .trim();
                if (valid.includes(_size)) {
                  continue;
                }
                _size = _size.slice(0, _size.length - 8).trim();
                list_size.push(_size);
              }

              data.push({
                id,
                price: price.replace(/\r?\n|\r/g, ""),
                title: title.replace(/\r?\n|\r/g, ""),
                url: `${url}${product_link}`,
                src: _image,
                size: list_size.toString(),
              });
            }
          } catch (error) {
            console.log("Bug Link Product");
          }
        }
      } catch (error) {
        console.log("Bug Fetch");
      }
    }
    csvWriter.writeRecords(data).then(() => console.log("done"));
    return exits.success(data);
  },
};
