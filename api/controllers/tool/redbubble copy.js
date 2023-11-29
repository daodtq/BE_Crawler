const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('fast-csv');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const { fromString } = require("@aws-sdk/util-buffer-from");
const { Readable } = require("stream");
const header = [
    "ID", "Type", "SKU", "Name", "Published", "Is featured?", "Visibility in catalog",
    "Short description", "Description", "Date sale price starts", "Date sale price ends",
    "Tax status", "Tax class", "In stock?", "Stock", "Low stock amount",
    "Backorders allowed?", "Sold individually?", "Weight (kg)", "Length (cm)",
    "Width (cm)", "Height (cm)", "Allow customer reviews?", "Purchase note",
    "Sale price", "Regular price", "Categories", "Tags", "Shipping class",
    "Images", "Download limit", "Download expiry days", "Parent", "Grouped products",
    "Upsells", "Cross-sells", "External URL", "Button text", "Position",
    "Attribute 1 name", "Attribute 1 value(s)", "Attribute 1 visible", "Attribute 1 global",
    "Attribute 1 default", "Attribute 2 name", "Attribute 2 value(s)", "Attribute 2 visible",
    "Attribute 2 global", "Attribute 2 default", "Attribute 3 name", "Attribute 3 value(s)",
    "Attribute 3 visible", "Attribute 3 global", "Attribute 3 default", "Attribute 4 name", "Attribute 4 value(s)", "Attribute 4 visible", "Attribute 4 global",
    "Attribute 4 default", "Attribute 5 name", "Attribute 5 value(s)", "Attribute 5 visible", "Attribute 5 global",
    "Attribute 5 default", "Meta: hwp_product_gtin"
]
module.exports = {
    friendlyName: "Index",
    description: "Index home",
    inputs: {
        link: { type: "string" },
        type: { type: "string" },
        file: { type: "json" },
        from: { type: "string" },
        end: { type: "string" },
        checked: { type: "boolean" },
        cate: { type: "string" },
    },
    exits: {
    },


    fn: async function (inputs, exits) {
        const { link, type, file, from, end, checked, cate } = inputs;
        let allData = [header]
        let productLinks = []
        let j = 0
        const fetchListingData = async () => {
            if (type == "link") {
                const browser = await puppeteer.launch({ headless: false });
                const page = await browser.newPage();

                try {
                    for (let i = from; i <= end; i++) {
                        const urlmain = `${link}?page=${i}/`;
                        await page.goto(urlmain, { waitUntil: 'domcontentloaded' });

                        const productLinksOnPage = await page.evaluate(() => {
                            const links = [];
                            document.querySelectorAll('#SearchResultsGrid > a').forEach(element => {
                                links.push(element.getAttribute('href'));
                            });
                            return links;
                        });

                        productLinks.push(...productLinksOnPage);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    await browser.close();
                }
            }
        }

        async function fetchData({ _index, url, browser, page }) {
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded' });

                const scriptContent = await page.$eval('script#__NEXT_DATA__', script => script.innerHTML);
                const items = JSON.parse(scriptContent).props.pageProps.inventoryCategorySet;
                const category = items.categoryName;
                const description = items.defaultItem.productInfo.longDescription.join("\n");

                let variable = {};
                const configurationSet = items.configurationSet.map((item, index) => {
                    const attributeName = item.name.replace("body", "").replace(/\b\w/g, match => match.toUpperCase());

                    if (!variable[attributeName]) variable[attributeName] = [];

                    if (!variable[attributeName].includes(item.attributes[0].value)) {
                        variable[attributeName].push(item.attributes[0].value);
                    }
                });

                const images = items.defaultItem.previewSet.previews.map(item => item.url);
                const idDefault = items.defaultItem.id;
                // Rest of your code to extract data using Puppeteer
            } catch (error) {
                console.error(error);
            } finally {
                await page.close();
            }

        }
        async function fetchAllData() {
            const browser = await puppeteer.launch({ headless: false });
            try {
                if (type != "link") {
                    productLinks = file
                }
                // console.log(productLinks)
                // const allDataPromises = productLinks.map(async (url, _index) => {

                //     page.push(await browser.newPage())
                //     fetchData({ _index, url, browser, page: page[_index] })
                // }
                // );
                // await Promise.all(allDataPromises);
                for (let i = 0; i < productLinks.length; i++) {
                    const url = productLinks[i];
                    const page = await browser.newPage();
                    await fetchData({ _index: i, url, browser, page });
                }

            } catch (error) {
                console.error(`Error fetching all data: ${error.message}`);
            }
        }

        if (type == "link") { await fetchListingData() }
        await fetchAllData();
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
    }
}