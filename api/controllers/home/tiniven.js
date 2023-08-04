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
  path: "tiniven.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "page", title: "Page" },
    { id: "title", title: "Title" },
    { id: "url", title: "URL" },
    { id: "src", title: "Src" },
    { id: "price", title: "Price" },
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
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = "https://tiniven.com";
    for (let i = 0; i < inputs.quantity; i++) {
      const response = await fetch(`${url}${inputs.url}/page/${i}/`, {
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
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          cookie:
            "_gcl_au=1.1.2093205089.1691138954; _ga=GA1.1.1449854109.1691138957; _ga_61QJEC34JY=GS1.1.1691138956.1.1.1691138998.18.0.0",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
      });
      const text = await response.text();
      var parser = new DomParser();

      var dom = parser.parseFromString(text);
      for (res of dom.getElementsByClassName("product_cat-t-shirt")) {
        try {
          const _res = (await res.getElementsByTagName("a"))[0];
          const product_link = _res.getAttribute("href");
          await page.goto(`${product_link}`);
          const title = await (
            await page.waitForSelector(".product-title")
          ).evaluate((el) => el.textContent);
          let price = await (
            await page.$$(".price_value")
          )[0].evaluate((el) => el.textContent);

          const image = await page.evaluate(
            (el) => el.getAttribute("src"),
            (await page.$$(".wp-post-image"))[0]
          );

          const color = await (await page.$$(".wcpa_sel_type_tick-border"))[0];
          const color_group = [];
          for (_color of color.getElementsByTagName("input")) {
            color_group.push(_color.getAttribute("value"));
          }

          const size = await (await page.$$(".wcpa_sel_type_tick-border"))[1];
          const size_group = [];
          for (_size of size.getElementsByTagName("span")) {
            size_group.push(_color.getAttribute("title"));
          }

          data.push({
            page: i,
            title: title.replace("\n", ""),
            url: `${product_link}`,
            price: price.replace("\n", ""),
            src: image,
            color: color_group.toString(),
            size: size_group.toString(),
          });
          return exits.success(data);
        } catch (error) {
          console.log(error);
        }
      }
    }
    csvWriter.writeRecords(data).then(() => console.log("done"));
    return exits.success(data);
  },
};
