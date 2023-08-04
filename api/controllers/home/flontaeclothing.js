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
  path: "flontaeclothing.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "page", title: "Page" },
    { id: "title", title: "Title" },
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
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = "https://flontaeclothing.com";
    for (let i = 0; i < inputs.quantity; i++) {
      console.log(i)
      const response = await fetch(`${url}${inputs.url}?page=${i}`, {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "vi,en;q=0.9",
          "if-none-match": 'W/"cacheable:d0a8bc08344cca8a3c5c879d6ceafdac"',
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
            'secure_customer_sig=; localization=US; cart_currency=USD; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22merchant_geo%22%3A%22US%22%2C%22sale_of_data_region%22%3Afalse%7D; _y=e36abc39-d485-430c-b6ce-cb9d4f4b21c8; _s=8a99e15d-ca61-465f-8a86-c5b04012ae09; _shopify_y=e36abc39-d485-430c-b6ce-cb9d4f4b21c8; _shopify_s=8a99e15d-ca61-465f-8a86-c5b04012ae09; _orig_referrer=; _landing_page=%2F; _shopify_sa_p=; _gcl_au=1.1.1775843344.1691056322; shopify_pay_redirect=pending; _ga=GA1.1.337205187.1691056322; edd_data={"store_id":"5570","plan":"premium","store_country_name":"Vietnam","store_country_code":"VN","user_country_name":"Vietnam","user_country_code":"VN","allowed_store":"0","trial_store":"0","plan_active":"active"}; newsletter-newsletter-popup=opened; fsb_previous_pathname=/collections/jordan-5-unc; _shopify_sa_t=2023-08-03T09%3A53%3A18.170Z; keep_alive=d90d14cf-7260-4c60-a8c1-fd0884c828f4; _ga_QR9F4PEHCB=GS1.1.1691056321.1.1.1691056625.0.0.0',
          Referer: "https://flontaeclothing.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      });
      const text = await response.text();
      var parser = new DomParser();

      var dom = parser.parseFromString(text);
      for (res of dom.getElementsByClassName("grid-product__link")) {
        try {
          const product_link = res.getAttribute("href");
          await page.goto(`${url}${product_link}`);
          const title = await (
            await page.waitForSelector(".product-single__title")
          ).evaluate((el) => el.textContent);
          const price = await (
            await page.waitForSelector(".product__price")
          ).evaluate((el) => el.textContent);
          const _image = [];
          for (image of await page.$$(".photoswipe__image ")) {
            _image.push(
              await page.evaluate(
                (el) => el.getAttribute("data-photoswipe-src"),
                image
              )
            );
          }
          const _color = [];
          for (color of await page.$$('fieldset[name="Color"] > div')) {
            _color.push(
              await page.evaluate((el) => el.getAttribute("data-value"), color)
            );
          }
          const _size = [];
          for (size of await page.$$('fieldset[name="Size"] > div')) {
            _size.push(
              await page.evaluate((el) => el.getAttribute("data-value"), size)
            );
          }
          data.push({
            page: i,
            title: title.replace("\n", ""),
            url: `${url}${product_link}`,
            price: price.replace("\n", ""),
            color: _color.toString(),
            src: _image.join(", "),
            size: _size.toString(),
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    csvWriter.writeRecords(data).then(() => console.log("done"));
    return exits.success(data);
  },
};
