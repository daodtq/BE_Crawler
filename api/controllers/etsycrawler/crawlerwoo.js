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
                const urlmain = `https://yourjewelleryshop.nz/product-category/other-personalised-gifts/lamps/page/${i}/`
                const response = await fetch(urlmain, {
                    method: 'GET',
                });
                const body = await response.text();
                const $ = cheerio.load(body);
                const _resP = $('a.woocommerce-LoopProduct-link.woocommerce-loop-product__link');

                _resP.each((index, element) => {
                    const product_link = $(element).attr('href');
                    if (!product_link.includes("ref=sc_gallery")) {
                        productLinks.push(`${product_link}`);
                    }
                });

            }
            for (let _url of productLinks) {
                const response = await fetch(_url, {
                    method: 'GET',
                });
                const body = await response.text();
                const $ = cheerio.load(body);

                const imageUrl = []
                const title = $('.product_title').text();
                const descriptionHtml = $('#tab-description').html();
                const price = $('.woocommerce-Price-amount').first().text();
                $('.woocommerce-product-gallery__image > a').each(function () {
                    imageUrl.push($(this).attr('href'));
                });
                allData.push({ title, descriptionHtml, price, imageUrl:imageUrl.join(", ") })
            }

        }
        await fetchListingData();
        return exits.success(allData);
    }
}