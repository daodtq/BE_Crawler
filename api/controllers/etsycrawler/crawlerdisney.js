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
            for (let i = 1; i < 100; i++) {
                const urlmain = `https://www.etsy.com/search/clothing/womens-clothing/tops-and-tees/tshirts?q=disney+shirt&explicit=1&ship_to=US&page=${i}&ref=pagination`
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
                        "cookie": "uaid=AkovfaFsGGxrMqIJiVB2YXz7JO9jZACCVN9Hj2F0tVJpYmaKkpVSbpinmbFuqolLlktBYUa6aaSxkWWBR5Chi7tuolItAwA.; user_prefs=yKI9KdE-ChiH5yRPnwMGdyinEnhjZACCVN9Hj2F0tFKYn4uSTl5pTo6OUmqebmiwkg5QCCpiBKFwEbEMAA..; fve=1699603171.0; _fbp=fb.1.1699603171961.3431392936605298; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FAbelRucenLake; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.1755311406.1699603175; _ga=GA1.1.217590824.1699603175; _uetsid=16e28a107f9f11ee9f2fcd053bd4f4c2; _uetvid=a380b3e0369411eea45591d5d30cedf6; lantern=5daf979c-62a8-46c6-994a-7c2773420851; _pin_unauth=dWlkPVlqSTFPR0l5WVRZdE9EazJNQzAwTXpRd0xXSTBNREF0T0RSa05XWXhNV1l4WVRBeA; _ga_KR3J610VYM=GS1.1.1699603175.1.0.1699603178.57.0.0; datadome=dnaUfBuve16THyE6g~KILTh5b81sbblzE3IGNuDumTBjpeYyyM6pDfYUmJS8dMJf9LGm7bzGPgQylsKNKByLdGco_714C6fw~Fivhs7wBhV5NePvjOqH08ppRn4ho6M2"
                    }, referrerPolicy: "strict-origin-when-cross-origin", body: null
                });
                const body = await response.text();
                const $ = cheerio.load(body);
                const _resP = $('.listing-link');

                _resP.each((index, element) => {
                    const product_link = $(element).attr('href');
                    if (!product_link.includes("ref=sc_gallery")) {
                        productLinks.push(`${product_link}`);
                        console.log(product_link)
                    }
                });

            }

        }
        await fetchListingData();
        const outputPath = 'product_links.txt';
        fs.writeFileSync(outputPath, productLinks.join('\n'));
        return exits.success("data");
    }
}