'use strict';
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const bcrypt = require("bcryptjs")
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
        hash: { type: "string" }, time: { type: "number" },
    },
    exits: {
    },
    fn: async function (inputs, exits) {
        const { link, type, file, from, end, checked, cate, hash, time } = inputs;
        let allData = [header]
        let productLinks = []
        let j = 0

        const fetchUser = async () => {
            let existAccount = await Google.find();
            for (const _existAccount of existAccount) {
                const result = await new Promise((resolve, reject) => {
                    bcrypt.compare(_existAccount.mail, hash, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                if (result) {
                    let _time = await Google.findOne({ mail: _existAccount.mail })
                    _time = _time?.time
                    if (time == _time) {
                        return 0; // Thực hiện các hành động sau khi xác thực thành công
                    } else {
                        return 1
                    }
                }
            }
        }

        const fetchListingData = async () => {
            if (type == "link") {
                for (let i = from; i <= end; i++) {
                    const urlmain = `${link}?page=${i}/`
                    const response = await fetch(urlmain, {
                        method: 'GET',
                    });
                    const body = await response.text();
                    const $ = cheerio.load(body);
                    const _resP = $('.m-tiles__preview');
                    console.log(response)

                    _resP.each((index, element) => {
                        const product_link = $(element).attr('href');
                        productLinks.push(`https://www.teepublic.com${product_link}`);
                    });
                }
            }
        }

        async function fetchData({ _index, url }) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch data from ${url}`);
                }

                const body = await response.text();
                const $ = cheerio.load(body);
                const scriptContent = $('script').filter((i, el) => {
                    return $(el).html().includes("TeePublic['ProductOptions']");
                }).html();
                const title = $('.m-design__title > h1').text();
                const descriptionHtml = $('.m-design__description').text()
                // Sử dụng các phương thức String để trích xuất giá trị của biến
                const startIndex = scriptContent.indexOf("TeePublic['ProductOptions'] = {") + "TeePublic['ProductOptions'] = ".length;
                const endIndex = scriptContent.indexOf('};', startIndex);
                const productOptionsString = scriptContent.substring(startIndex, endIndex + 1);
                // return exits.success(productOptionsString)
                // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
                let productOptions = JSON.parse(productOptionsString);
                const scriptContent1 = $('script[type="application/ld+json"]').html();
                const jsonData = JSON.parse(scriptContent1);
                const c = jsonData.category
                const number = c == "T-Shirt" ? 1 : c == "Tank Top" ? 2 : c == "Hoodie" ? 4 : c == "Crewneck Sweatshirt" ? 5 : c == "Long Sleeve T-Shirt" ? 7 : c == "Baseball T-Shirts" ? 8 : c == "Kids T-Shirt" ? 3 : c == "Kids Hoodie" ? 14 : c == "Kids Long Sleeve T-Shirt" ? 15 : c == "Baby Bodysuits" ? 13 : c == "Posters and Art Prints" ? 6 : c == "Pillow" ? 17 : c == "Tote" ? 18 : c == "Mug" ? 12 : c == "Tapestry" ? 19 : c == "Pin" ? 20 : c == "Phone Case" ? 9 : c == "Sticker" ? 16 : c == "Magnet" ? 21 : 0
                const activeProductId = productOptions.DesignOptions.active_product_ids
                const product = productOptions.CanvasOptions.products
                const hierarchy = productOptions.CanvasOptions.hierarchy.map(item => item.slug);
                const activeProduct = []
                let variant = {}
                const responseImage = await fetch(`https://www.teepublic.com/designs/${url.match(/\/(\d+)-/)[1]}/canvas/${number}/product_images`, {
                    redirect: 'manual',
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "vi,en;q=0.9",
                        "if-none-match": "W/\"42cb25694c6394cac0689adfeaa38e5a\"",
                        "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "Referer": "https://www.teepublic.com/t-shirt/23829810-science-with-bunsen-and-beaker",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    method: 'GET',
                })

                const imageJSON = await responseImage.json();
                if (!responseImage.ok) {
                    throw new Error(`Failed to fetch data from ${url}`);
                }
                for (let _activeProductId of activeProductId) {
                    if (checked && !cate.slice("|").includes(product[_activeProductId].attributes?.style?.name)) {
                        continue
                    }
                    const atribute = []
                    for (let _atribute of Object.keys(product[_activeProductId].attributes)) {
                        if (!variant[_atribute]) {
                            variant[_atribute] = []
                        }
                        if (!variant[_atribute].includes(product[_activeProductId].attributes[_atribute].name)) { variant[_atribute].push(product[_activeProductId].attributes[_atribute].name) }
                        atribute.push([_atribute.replace(/\b\w/g, match => match.toUpperCase()), product[_activeProductId].attributes[_atribute].name])
                    }
                    for (let _img of imageJSON.images) {
                        let i = 0
                        for (let _product_ids of _img.product_ids) {
                            if (_product_ids == _activeProductId) {
                                activeProduct.push([title, product[_activeProductId].attributes?.style?.name ? product[_activeProductId].attributes?.style.name : product[_activeProductId].attributes[hierarchy[0]].name, atribute, product[_activeProductId].sale_price, product[_activeProductId].retail_price, _img.images[0].url.replace(/ /g, "%20").replace(/,/g, "%2C")])
                                i = 1
                                break
                            }
                        }
                        if (i == 1) break
                    }
                }
                const skuTime = `t${moment().unix()}`

                for (let [index, row] of activeProduct.entries()) {
                    if (index == 0) {
                        let aaaa = [`${skuTime}-${_index}`, "variable", `${skuTime}-${_index}`, row[0], "1", "0", "visible", "", descriptionHtml, "", "", "taxable", "", "1", "", "", "0", "0", "", "", "", "", "1", "", "", "", c, "", "", row[5], "", "", "", "", "", "", "", "", "0"]
                        for (let _variant of Object.keys(variant)) {
                            aaaa.push(_variant.replace(/\b\w/g, match => match.toUpperCase()), variant[_variant].join(","), 1, 1, variant[_variant][0])
                        }
                        allData.push(aaaa)
                    }
                    let bbbb = [`${skuTime}-${_index}-${index}`, "variation", `${skuTime}-${_index}-${index}`, row[0], "1", "0", "visible", "", "", "", "", "taxable", "parent", "1", "", "", "0", "0", "", "", "", "", "1", "", row[3], row[4], "", "", "", row[5], "", "", `${skuTime}-${_index}`, "", "", "", "", "", index + 1]
                    for (let _variant of row[2]) {
                        bbbb.push(_variant[0], _variant[1], "", 1, "")
                    }
                    allData.push(bbbb)
                }
            } catch (error) {
                return null;
            }
        }
        async function fetchAllData() {
            // try {
                if (type != "link") {
                    productLinks = file
                }
            //     const allDataPromises = productLinks.map((url, _index) => fetchData({ _index, url }));
            //     await Promise.all(allDataPromises);

            // } catch (error) {
            //     console.error(`Error fetching all data: ${error.message}`);
            // }
            const concurrency = 30; // Số lượng đồng thời
            const results = [];

            async function runBatch(batchUrls) {
                const batchPromises = batchUrls.map((url, index) => fetchData({ _index: index, url }));
                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);
            }

            for (let i = 0; i < productLinks.length; i += concurrency) {
                const batchUrls = productLinks.slice(i, i + concurrency);
                await runBatch(batchUrls);
            }
        }
        const res = await fetchUser()
        if (res != 0) {
            return exits.success({ status: 1, message: "Tài khoản đang đăng nhập nơi khác, đăng nhập lại" });
        } else {
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
}