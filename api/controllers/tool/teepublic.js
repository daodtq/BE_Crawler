const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('fast-csv');
const stringify = require('csv-stringify');
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
    },
    exits: {
    },
    fn: async function (inputs, exits) {
        const { link, type, file, from, end } = inputs;
        let allData = []
        let productLinks = []
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

                    _resP.each((index, element) => {
                        const product_link = $(element).attr('href');
                        productLinks.push(`https://www.teepublic.com${product_link}`);
                    });
                }
            }
        }

        async function fetchData(url) {
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
                const descriptionHtml = $('.m-google-faq__container').html().replace(/\n/g, "");
                // Sử dụng các phương thức String để trích xuất giá trị của biến
                const startIndex = scriptContent.indexOf("TeePublic['ProductOptions'] = {") + "TeePublic['ProductOptions'] = ".length;
                const endIndex = scriptContent.indexOf(';', startIndex);
                const productOptionsString = scriptContent.substring(startIndex, endIndex);


                // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
                const productOptions = JSON.parse(productOptionsString);
                const activeProductId = productOptions.DesignOptions.active_product_ids
                const product = productOptions.CanvasOptions.products
                const hierarchy = productOptions.CanvasOptions.hierarchy.map(item => item.slug);
                const activeProduct = []
                let variant = {}
                const responseImage = await fetch(`https://www.teepublic.com/designs/${url.match(/\/(\d+)-/)[1]}/canvas/1/product_images`, {
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
                    const atribute = []
                    // if (!variant[product[_activeProductId].attributes]) {
                    //     variant[product[_activeProductId].attributes] = []
                    // }
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
                                activeProduct.push([title, product[_activeProductId].attributes.style.name, atribute, product[_activeProductId].sale_price, product[_activeProductId].retail_price, _img.images[0].url.replace(/ /g, "%20")])
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
                        let aaaa = [skuTime, "variable", skuTime, row[0], "1", "0", "visible", "", descriptionHtml, "", "", "taxable", "", "1", "", "", "0", "0", "", "", "", "", "1", "", "", "", variant.style.join(","), "", "", row[5], "", "", "", "", "", "", "", "", "0"]
                        for (let _variant of Object.keys(variant)) {
                            aaaa.push(_variant.replace(/\b\w/g, match => match.toUpperCase()), variant[_variant].join(","), 1, 1, variant[_variant][0])
                        }
                        allData.push(aaaa)
                    }
                    let bbbb = [`${skuTime}-${index}`, "variation", `${skuTime}-${index}`, row[0], "1", "0", "visible", "", "", "", "", "taxable", "parent", "1", "", "", "0", "0", "", "", "", "", "1", "", "", row[3], row[1], "", "", row[5], "", "", skuTime, "", "", "", "", "", index]
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
            try {
                let _productLinks = [productLinks[0]]
                const allDataPromises = _productLinks.map(url => fetchData(url));
                await Promise.all(allDataPromises);

            } catch (error) {
                console.error(`Error fetching all data: ${error.message}`);
            }
        }
        function convertToCSV(data) {
            // Chuyển đổi mảng hai chiều thành chuỗi CSV
            const csvRows = [];
            for (const row of data) {
                const csvRow = row.map(value => `"${value}"`).join(',');
                csvRows.push(csvRow);
            }
            return csvRows.join('\n');
        }
        await fetchListingData();
        await fetchAllData();
        const stream = fs.createWriteStream('data.csv');

        // Create a CSV stream
        const csvStream = csv.format({ headers: false });

        // Pipe the CSV stream to the writable stream
        csvStream.pipe(stream);

        // Write each row to the CSV stream
        allData.forEach(row => csvStream.write(row));

        // End the CSV stream
        csvStream.end();

        // Wait for the stream to finish writing before sending the response
        stream.on('finish', () => {
            // Optionally, you can move the file to a public directory
            const filePath = 'data.csv';
            fs.renameSync('data.csv', filePath);

            // Set response message with download link
            const downloadLink = `${this.req.protocol}://${this.req.get('host')}/data.csv`;
            return this.res.ok(`File created successfully. Download link: ${downloadLink}`);
        });
    }
}