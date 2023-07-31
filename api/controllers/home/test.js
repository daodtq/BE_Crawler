const cheerio = require("cheerio");
const unirest = require("unirest");

const amazon = async (url) => {
  const amazon_url = url;
  const head = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  };
  const data = await unirest.get(amazon_url).headers(head);

  return { message: data.body };
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
    // All done.\
    const result = { about: [] };
    const list = [];
    const styleName = [];

    amazon(inputs.url).then((data) => {
      const $ = cheerio.load(data.message);

      $("span#productTitle").each((i, el) => {
        result.title = $(el).text().trim();
      });

      $("span.priceToPay").each((i, el) => {
        result.price = $(el).find("span").first().text();
      });

      // $("ul.swatchesSquare")
      //   .find("li")
      //   .each((i, el) => {
      //     list.push($(el).attr("title").replace("Click to select ", ""));
      //   });
      //   result.list = list

      for (let i = 0; i < $("ul.swatchesSquare").find("li").length; i++) {
        if ($(`li#style_name_${i}`)) {
          const styleName = $(`li#style_name_${i}`).first().attr("title");

          list.push(styleName);
        }
      }

      result.list = list;

      $("div#feature-bullets").each((i, el) => {
        result.about = $(el).find("ul").text();
      });

      return exits.success(result);
    });
  },
};
