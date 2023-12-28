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
            for (let i = 1; i <= 14; i++) {
                const urlmain = i == 1 ? `https://www.itshot.com/watches/mens-diamond-watches?limit=72` : `https://www.itshot.com/watches/mens-diamond-watches?limit=72&p=${i}`
                const response = await fetch(urlmain, {
                    method: 'GET',
                });
                const body = await response.text();
                const $ = cheerio.load(body);
                const _resP = $('.product-name');

                _resP.each((index, element) => {
                    if (i == 1 && index < 4) {
                        return
                    }
                    const product_link = $(element).attr('href');
                    productLinks.push(product_link);
                });

            }
            for (let _url of productLinks) {
                try {
                    const response = await fetch(_url, {
                        method: 'GET',
                    });
                    const body = await response.text();
                    const $ = cheerio.load(body);

                    const imageUrl = []
                    const title = $('#product-name-desktop > h1').text();
                    const descriptionHtml = `${$('.description-detail').html()}${$('.detail-content').html()}`
                    let price = $('span.price:eq(1)').text();
                    price = price.replace("\n", "").replace(",", "").replace("$", "")
                    $('#amasty_gallery > span').each(function () {
                        const dataImage = $(this).attr('data-image');
                        console.log(dataImage);
                        imageUrl.push(dataImage);
                    });
                    console.log({ title, descriptionHtml, price, imageUrl: imageUrl.join(", ") })
                    allData.push({ title, descriptionHtml, price, imageUrl: imageUrl.join(", ") })
                } catch (error) {
                    console.log("ERROR", _url)
                }
            }

        }
        await fetchListingData();
        return exits.success(allData);
    }
}