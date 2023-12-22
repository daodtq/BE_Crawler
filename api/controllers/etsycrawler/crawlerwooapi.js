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
        let data = []
        const fetchListingData = async () => {
            const fetchPage = async (i) => {
                const urlmain = `https://shop.ocasionshop.com/wp-json/wc/store/products?per_page=100&attribute=id&page=${i}`;
                const response = await fetch(urlmain, {
                    method: 'GET',
                });
                const jsonn = await response.json();
                return jsonn;
            };

            const concurrencyLimit = 10;
            const totalPages = 170;
            const fetchPromises = [];

            for (let i = 1; i <= totalPages; i += concurrencyLimit) {
                const promisesBatch = [];

                for (let j = 0; j < concurrencyLimit && i + j <= totalPages; j++) {
                    promisesBatch.push(fetchPage(i + j));
                }

                const jsonDataArray = await Promise.all(promisesBatch);
                jsonDataArray.forEach((jsonn) => {
                    for (let items of jsonn) {
                        const image = items.images.map((_image) => _image.src);
                        allData.push([items?.sku, items?.name, items?.description, (items?.prices?.regular_price / 100).toFixed(2), image.length > 0 ? image.join(", ") : "", items?.slug])
                    }
                });
            }

            // const fetchPromises = [];

            // for (let i = 1; i <= 170; i++) {
            //     fetchPromises.push(fetchPage(i));
            // }

            // const jsonDataArray = await Promise.all(fetchPromises);

            // jsonDataArray.forEach((jsonn) => {
            //     for (let items of jsonn) {
            //         const image = items.images.map((_image) => _image.src);
            //         allData.push([items?.sku, items?.name, items?.description, (items?.prices?.regular_price / 100).toFixed(2), image.length > 0 ? image.join(", ") : "", items?.slug])
            //     }
            // });

            // for (let i = 1; i <= 170; i++) {
            //     const urlmain = `https://shop.ocasionshop.com/wp-json/wc/store/products?per_page=100&attribute=id&page=${i}`
            //     const response = await fetch(urlmain, {
            //         method: 'GET',
            //     });

            //     let jsonn = await response.json()
            //     data = [data, ...jsonn]
            // }
            // for (let items of data) {
            //     const image = []
            //     for (let _image of items.images) {
            //         image.push(_image.src)
            //     }
            //     allData.push([items?.sku, items?.name, items?.description, (items?.prices?.regular_price / 100).toFixed(2), image.length > 0 ? image.join(", ") : "", items?.slug])
            // }
        }
        await fetchListingData();
        const stream = fs.createWriteStream('data.csv');
        const csvStream = csv.format({ headers: false });
        csvStream.pipe(stream);
        allData.forEach(row => csvStream.write(row));
        csvStream.end();
        stream.on('finish', async () => {
            const filePath = 'data.csv';
            fs.renameSync('data.csv', filePath);
            return exits.success({ status: 0 });
        });
        return exits.success("done");
    }
}