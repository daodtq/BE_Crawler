
'use strict';

const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { Cluster } = require('puppeteer-cluster');
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
                const browser = await puppeteer.launch({ headless: true, args: ['-no-sandbox'] });
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
                const title = await page.$eval('#__next > div > main > div > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(1) > div > h1', element => element.textContent);

                let variable = {};
                items.configurationSet.map(item => {
                    if (item.name == "configuration") {
                        return
                    }
                    const attributeName = item.name.replace("body", "").replace(/\b\w/g, match => match.toUpperCase());
                    if (!variable[attributeName]) {
                        variable[attributeName] = [];
                    }
                    if (!variable[attributeName].includes(item.attributes.find(attribute => attribute.name === "defaultText").value)) {
                        variable[attributeName].push(item.attributes.find(attribute => attribute.name === "defaultText").value);
                    }
                });


                const images = items.defaultItem.previewSet.previews.map(item => item.url.replace(/,/g, "%2C"));
                const idDefault = items.defaultItem.id;
                const parent = [idDefault, "variable", idDefault, title, "1", "0", "visible", "", description, "", "", "taxable", "", "1", "", "", "0", "0", "", "", "", "", "1", "", "", "", category, "", "", images.join(", "), "", "", "", "", "", "", "", "", "0"]
                for (let _variant of Object.keys(variable)) {
                    parent.push(_variant, variable[_variant].join(","), 1, 1, variable[_variant][0])
                }
                allData.push(parent)
                for (let item of items.items) {
                    const child = [item.id, "variation", item.id, title, "1", "0", "visible", "", "", "", "", "taxable", "parent", "1", "", "", "0", "0", "", "", "", "", "1", "", item.price.amount, item.price.discount.amount, "", "", "", item.previewSet.previews[0].url.replace(/,/g, "%2C"), "", "", idDefault, "", "", "", "", "", "0"]
                    for (let _variant of item.attributes) {
                        child.push(_variant.name.replace("body", "").replace(/\b\w/g, match => match.toUpperCase()), _variant.attributes.find(attribute => attribute.name === "defaultText").value, "", 1, "")
                    }
                    allData.push(child)
                }
            } catch (error) {
                console.error(url, error);
            } finally {
                // await page.close();
            }

        }
        async function fetchAllData() {
            const cluster = await Cluster.launch({
                concurrency: Cluster.CONCURRENCY_CONTEXT,
                maxConcurrency: 3, // Số lượng luồng bạn muốn chạy
                puppeteerOptions: {
                    headless: true,
                    args: ['-no-sandbox']
                },
            });
            try {
                if (type != "link") {
                    productLinks = file;
                }
                await cluster.task(async ({ page, data: { url, index } }) => {
                    await fetchData({ _index: index, url, browser: null, page });
                });

                for (let i = 0; i < productLinks.length; i++) {
                    const url = productLinks[i];
                    cluster.queue({ url, index: i });
                }
                await cluster.idle();
            } catch (error) {
                console.error(`Error fetching all data: ${error.message}`);
            } finally {
                await cluster.close();
            }
        }

        if (type == "link") { await fetchListingData() }
        await fetchAllData();
        if (allData.length == 1) {
            return exits.success({ status: 1, message: "Link cung cấp không phù hợp hoặc sai!" });
        }
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