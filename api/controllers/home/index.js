
const cheerio = require("cheerio");
const unirest = require("unirest");

const url = "https://www.amazon.com/DualSense-Wireless-Controller-PlayStation-5/dp/B08FC6C75Y/ref=pd_vtp_h_pd_vtp_h_sccl_3/144-3346908-6120219?pd_rd_w=uGQz8&content-id=amzn1.sym.e16c7d1a-0497-4008-b7be-636e59b1dfaf&pf_rd_p=e16c7d1a-0497-4008-b7be-636e59b1dfaf&pf_rd_r=QYP0KXCP5XNT291S0WG2&pd_rd_wg=ogxee&pd_rd_r=c33e92d7-8efd-4459-a3f6-721bbfd135a6&pd_rd_i=B08FC6C75Y&psc=1"

const amazon = async () => {
  const amazon_url = url;
  const head = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  };
  const data = await unirest.get(amazon_url).headers(head);

  return { message: data.body };
}

module.exports = {


  friendlyName: 'Index',


  description: 'Index home.',


  inputs: {

  },


  exits: {

  },


  fn: async function (_, exits) {
    // All done.

    const result = { about: [] };

    amazon().then((data) => {
      const $ = cheerio.load(data.message);


      $("span#productTitle").each((i, el) => {
        result.title = $(el).text().trim();
      });

      $("span.priceToPay").each((i, el) => {
        result.price = $(el).find('span').first().text();
      });


      // $("ul.swatchesSquare").each((i, el) => {
      //   result.option = $(el).find("li").text();
      // });
      $("ul.swatchesSquare").each((i, el) => {
        console.log($(el).find("li").text())
      result.option = $(el).find("li").text();
    });
    $("div#feature-bullets").each((i, el) => {
      result.about = $(el).find('ul').text()

    });

    return exits.success(result);
  });

}

};
