
'use strict';

const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('fast-csv');

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
const proxies = [
    "http://204.9.59.5:41468:zBXgFYrJqcblaZ5:1Yc7K0Pl8nd0vIT",
    "http://204.9.59.86:43542:p7BQXRoR39VFYqT:1GEmdtdy12QXNFw",
    "http://45.199.149.229:42346:YrOJXDuMiv8UZoG:80Xk675JBNccYBq",
    "http://139.171.88.16:48883:ur4ErsJKzsWBZsE:FwlVq4NGsNZdM7A",
    "http://139.171.88.57:46581:oK0LHqXeLBWz43j:qCOm9YfDCPYt4jE",
    "http://139.171.90.146:45984:S02mTUTIO3JTnAh:Pv2UmlcAuOm8GSz",
    "http://139.171.90.208:43063:ygERNBZwyR1XIy2:cyNLgxCGB4czd2G",
    "http://139.171.90.243:46947:AzWjkQ89FFSmapM:Sv3SgI7PI2H0Ldw",
    "http://139.171.90.55:41703:g3ynanI5gNEr8ET:FFk6ICKVbKCiyCT",
    "http://139.171.90.70:49287:XsPPR8LYgcnpzrn:Gw7rmQUxVHDaGtT",
    "http://139.171.91.77:41169:mXtRrsFp6wB42zE:SwbwIIRrfrxVZjo",
    "http://204.9.59.140:45966:zLD1BvPp4Hnv224:5cDY4AEM5wwR4MM",
    "http://204.9.59.241:44223:wVQKSja1wmSEiMB:Qg2o60DU9GEH2B4",
    "http://207.228.10.73:48205:kpXhN55ja0V4ece:LY2ALwCKdGYZk7S",
    "http://207.228.27.140:48694:FCyKmAlRszHNoQ1:BqQ2DMt5pRj4q6C",
    "http://207.228.43.132:41869:uHzRaBX0r2UTglu:jHZeUH5S3RyvcEn",
    "http://207.228.47.141:49121:TigpqQt47Qzs5IC:GtrCdCf779CBROF",
    "http://207.228.47.185:49135:k6p4wtFIGhnhm43:w7LiRbRtNp1fP4Z",
    "http://207.228.51.101:48553:nS3Re6nmy3Ze0pH:K4lEcclP3X0GDzO",
    "http://207.228.52.83:47570:TC6aSopoBXBZYk9:k9HgvhtTJaKAooC",
    "http://207.228.54.190:45062:MsXxtFpkCFAl9n6:5hapTrCvTJcfrJd",
    "http://207.228.60.145:44856:L0ouou6Fji5keWg:UOLrdBzPWjmYfws",
    "http://207.228.63.23:44241:mYpLu7nOkfvALP5:0EHUGbdBzUzVaZT",
    "http://107.180.132.21:44575:uw1MFER5nZVNZNL:p5KeD6L8vHzD7dJ",
    "http://107.180.161.171:47741:A0cnDvhnrLbmvIr:SNXj3MZ6T960ln4",
    "http://107.180.162.27:45351:HCcf42l5n7oCaw3:oGVCrALQN8MHIsB",
    "http://107.180.164.251:43372:YcJ72g2t0nS71EI:2CKrJJTYIwxAvjM",
    "http://107.180.166.122:46811:WroURko2XYIr5O4:uCmOMcvaw0Bntia"
]
function getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    return proxies[randomIndex];
}
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
                const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
                const page = await browser.newPage();

                try {
                    for (let i = from; i <= end; i++) {
                        const urlmain = `${link}?page=${i}/`;
                        await page.goto(urlmain, { waitUntil: 'domcontentloaded' });
                        page.on('response', async (response) => {
                            const url = response.url();
                            if (url.includes('example.com')) {
                                const body = await response.text();
                                console.log(`Body of ${url}:`, body);
                            }
                        });
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
                await page.close();
            }

        }

        async function fetchAllData() {
            const maxConcurrency = 5;
            if (type != "link") {
                productLinks = file;
            }

            const browser = await puppeteer.launch({
                headless: false, args: ['--no-sandbox']
            });

            try {
                for (let i = 0; i < productLinks.length; i += maxConcurrency) {
                    const chunk = productLinks.slice(i, i + maxConcurrency);
                    const pagePromises = [];
                    for (let j = 0; j < chunk.length; j++) {
                        const url = chunk[j];
                        const page = await browser.newPage();
                        await page.setRequestInterception(true);
                        page.on('request', (request) => {
                            const resourceType = request.resourceType();
                            if (resourceType === 'image') {
                                request.abort();
                            } else {
                                const proxy = getRandomProxy()
                                request.continue({ proxy });
                            }
                        });
                        const fetchDataPromise = fetchData({ _index: i + j, url, browser, page });

                        pagePromises.push(fetchDataPromise);
                    }
                    await Promise.all(pagePromises);
                }
            } catch (error) {
                console.error(`Error fetching data: ${error.message}`);
            } finally {
                await browser.close();
            }
        }


        if (type == "link") { await fetchListingData() }
        await fetchAllData();
        if (allData.length == 1) {
            return exits.success({ status: 1, message: "Hiện tại đang bảo trì!" });
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