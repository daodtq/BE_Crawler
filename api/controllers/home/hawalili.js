/**
 * IndexController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var DomParser = require("dom-parser");
const puppeteer = require("puppeteer");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "hawalili.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "title", title: "Title" },
    { id: "price", title: "Price" },
    { id: "url", title: "URL" },
    { id: "src", title: "Src" },
    { id: "type", title: "Type" },
    { id: "style", title: "Style" },
    { id: "color", title: "Color" },
    { id: "size", title: "Size" },   


  ],
});
module.exports = {
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
    const data = [];
    const url = "https://www.hawalili.com";
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const response = await fetch(`${url}${inputs.url}?page=${1}`, {
      headers: {
        "sec-ch-ua":
          '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
        Referer: "https://www.hawalili.com/",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    });
    const text = await response.text();
    var parser = new DomParser();

    var dom = parser.parseFromString(text);
    for (res of dom.getElementsByClassName("product-item")) {
      try {
        const _res = (await res.getElementsByTagName("a"))[0];
        const product_link = _res.getAttribute("href");
        await page.goto(`${url}${product_link}`);
        const title = await (
          await page.waitForSelector(".cm-goods-detail-title-1")
        ).evaluate((el) => el.textContent);
        let price = "";
        if (await (await page.$$(".cm-goods-detail-price-activity")).length) {
          price = await (
            await page.$$(".cm-goods-detail-price-activity")
          )[0].evaluate((el) => el.textContent);
        } else {
          price = await (
            await page.$$(".cm-goods-detail-price")
          )[0].evaluate((el) => el.textContent);
        }

        const _image = [];
        for (image of await page.$$(".swiper-zoom-target > span > noscript ")) {
          let script = await image.evaluate((el) => el.textContent);

          var temp = new DomParser().parseFromString(script);
          _image.push(
            `${url}${temp.getElementsByTagName("img")[0].getAttribute("src")}`
          );
        }
        for (image of await page.$$(".swiper-zoom-target > span > img ")) {
          if (await page.evaluate((el) => el.getAttribute("srcset"), image)) {
            const newImage = `${url}${await page.evaluate(
              (el) => el.getAttribute("src"),
              image
            )}`;

            if (!_image.includes(newImage)) {
              _image.push(newImage);
            }
          }
        }
        const _color = [];
        for (color of await page.$$(".w-9 > div > span > img")) {
          _color.push(
            await page.evaluate((el) => el.getAttribute("alt"), color)
          );
        }
        const _size = [];
        for (size of await page.$$(".p-2")) {
          _size.push(
            await page.evaluate((el) => el.getAttribute("title"), size)
          );
        }
        data.push({
          page:i,
          title: title.replace("\n", ""),
          url: `${url}${product_link}`,
          price: price.replace("\n", ""),
          src: _image.join(" "),
          color: _color.toString(),
          size: _size.toString(),
        });
      } catch (error) {
        console.log(error);
      }
    }
    csvWriter.writeRecords(data).then(() => console.log("done"));
    return exits.success(data);
  },
};
