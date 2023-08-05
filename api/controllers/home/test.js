var DomParser = require("dom-parser");

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
    const response = await fetch(
      "https://www.cliffteeaz.com/page/2/?s=2&post_type=product",
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "vi,en;q=0.9",
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
            "wp_woocommerce_session_045a9f75c64f472e952cf9b3fe110129=t_c69653782727e8d14e557fe1e9bda4%7C%7C1691376954%7C%7C1691373354%7C%7Cc57ea128316cf188e647b4033fe3f67c; wpmReferrer=www.google.com; _gcl_au=1.1.2006141870.1691204155; _gid=GA1.2.1272320948.1691204155; _gat_gtag_UA_260297935_1=1; _ga_RYMKEZ8GD4=GS1.1.1691204154.1.1.1691206454.0.0.0; _ga=GA1.1.201910142.1691204154; _ga_1K680Z6CD6=GS1.1.1691204154.1.1.1691206456.0.0.0",
        },
        referrerPolicy: "no-referrer",
        body: null,
        method: "GET",
      }
    );
    const text = await response.text();
    var parser = new DomParser();

    var dom = parser.parseFromString(text);
    
    // for (res of dom.getElementsByClassName("s-widget-spacing-small")) {
    // }
    return exits.success(dom.getElementsByClassName("shop-container")[0].innerHTML);
  },
};
