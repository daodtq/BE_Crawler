const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const csv = require('fast-csv');
module.exports = {
    friendlyName: "Index",
    description: "Index home",
    inputs: {
        urls: { type: "json" },
    },
    exits: {},
    fn: async function (inputs, exits) {
        const productLinks = [];
        let allData = []
        const fetchListingData = async () => {
            for (let i = 1; i <= 1; i++) {
                const urlmain = `https://amomentofnow.com/search?q=enamel+mug&options%5Bprefix%5D=last&type=product`
                const response = await fetch(urlmain, {
                    method: 'GET',
                });
                const body = await response.text();
                const $ = cheerio.load(body);
                const _resP = $('#main-collection-product-grid > li > div > div > div.card-product > div > div.card-media.card-media--portrait.media--hover-effect.has-compare.media--loading-effect > a');

                _resP.each((index, element) => {
                    const product_link = $(element).attr('href');
                    productLinks.push(`https://amomentofnow.com/${product_link}`);
                });

            }
            for (let _url of productLinks) {
                const response = await fetch(_url, {
                    method: 'GET',
                });
                const body = await response.text();
                const $ = cheerio.load(body);

                const imageUrl = []
                const title = $('.productView-title > span').text();
                const descriptionHtml = $('#tab-description-mobile > div.tab-popup-content').html(); 
                const price = "30"
                
                $('.product-single__media > .media').each(function () {
                    imageUrl.push(`https:${$(this).attr('href')}`);
                });
                allData.push({ title, descriptionHtml, price, imageUrl: imageUrl.join(", ") })
            }

        }
        await fetchListingData();
        return exits.success(allData);
    }
}