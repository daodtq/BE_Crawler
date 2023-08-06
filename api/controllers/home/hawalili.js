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
const method = {
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
}
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
    for (let i = 0; i < inputs.quantity; i++) {
      const response = await fetch(`${url}${inputs.url}?page=${1}`, method);
      const text = await response.text();
      var parser = new DomParser();
      var dom = parser.parseFromString(text);
      for (res of dom.getElementsByClassName("product-item")) {
        try {
          const _res = (await res.getElementsByTagName("a"))[0];
          const product_link = _res.getAttribute("href");
          const _response = await fetch(`${url}${product_link}`, method)
          var dom_product = parser.parseFromString(await _response.text());
          const title = (dom_product.getElementsByClassName("cm-goods-detail-title-1"))[0].textContent
          let price = "";
          if (dom_product.getElementsByClassName("cm-goods-detail-price-activity").length) {
            price = dom_product.getElementsByClassName("cm-goods-detail-price-activity")[0].textContent
          } else {
            price = dom_product.getElementsByClassName("cm-goods-detail-price")[0].textContent
          }
          const _color = [];
          for (color of dom_product.getElementsByClassName("w-9")) {
            _color.push(color.getElementsByTagName("div")[0].getElementsByTagName("span")[0].getElementsByTagName("noscript")[0].getElementsByTagName("img")[0].getAttribute("alt"));
          }
          const _size = [];
          for (size of dom_product.getElementsByClassName("p-2")) {
            _size.push(size.getAttribute("title"));
          }
          const _image = [];
          for (image of dom_product.getElementsByClassName("swiper-zoom-target")) {
            _image.push(
              `${url}${image.getElementsByTagName("span")[0].getElementsByTagName("noscript")[0].getElementsByTagName("img")[0].getAttribute("src")}`
            );
          }
          data.push({
            page: i,
            title: title.replace("\n", ""),
            url: `${url}${product_link}`,
            price: price.replace("\n", ""),
            src: _image.join(", "),
            color: _color.toString(),
            size: _size.toString(),
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    // csvWriter.writeRecords(data).then(() => sails.bot.sendDocument(-895677272, "hawalili.cs"));
    return exits.success(data);
  },
};
