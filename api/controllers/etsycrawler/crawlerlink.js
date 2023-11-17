const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Referer": "https://www.etsy.com/",
    // Add other headers as necessary
}

module.exports = {
    friendlyName: "Index",
    description: "Index home",
    inputs: {
        urls: { type: "json" },
    },
    exits: {},
    fn: async function (inputs, exits) {
        const productLinks = [];
        const fetchListingData = async () => {
            for (let i = 1; i <= 3; i++) {
                const urlmain = `https://joyboxfactory.com/collections/illusion-clock?page=${i}`
                const response = await fetch(urlmain, {
                    method: 'GET',
                    headers: {
                        ...headers,
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "vi,en;q=0.9",
                        "cache-control": "max-age=0",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "none",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1",
                    }, referrerPolicy: "strict-origin-when-cross-origin", body: null
                });
                const body = await response.text();
                const $ = cheerio.load(body);
                const _resP = $('div > div > div.card__content > div.card__information > h3 > a');

                _resP.each((index, element) => {
                    const product_link = $(element).attr('href');
                    if (product_link != "etsy.com?ref=sc_gallery"){
                        productLinks.push(`https://joyboxfactory.com${product_link}`);

                    }
                    console.log(product_link)
                });

            }

        }
        await fetchListingData();
        const uniqueProductLinksSet = new Set(productLinks);

        // Chuyển tập hợp thành một mảng nếu cần thiết
        const uniqueProductLinksArray = Array.from(uniqueProductLinksSet);
        const outputPath = 'product_links.txt';
        fs.writeFileSync(outputPath, uniqueProductLinksArray.join('\n'));
        return exits.success("data");
    }
}