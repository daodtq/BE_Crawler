/**
 * IndexController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var DomParser = require("dom-parser");
const puppeteer = require("puppeteer");

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
          await page.waitForSelector(".break-words")
        ).evaluate((el) => el.textContent);
        const price = await (
          await page.waitForSelector(".cm-goods-detail-price-activity")
        ).evaluate((el) => el.textContent);

        const _image = [];
        for (image of await page.$$(".swiper-zoom-target > span > img")) {
          _image.push(
            `${url}${await page.evaluate((el) => el.getAttribute("src"), image)}`
          );
        }
        data.push({
          title: title.replace("\n", ""),
          price: price.replace("\n", ""),
          // color: _color.toString(),
          image: _image.join(" "),
          // size: _size.toString(),
        });
        return exits.success(data);
      } catch (error) {}
    }
    return exits.success(data);
  },
};
