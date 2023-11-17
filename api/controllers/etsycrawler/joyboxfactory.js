const puppeteer = require('puppeteer');
const moment = require('moment');
const ExcelJS = require('exceljs');
var fs = require('fs');
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet 1');
module.exports = {
    friendlyName: "Index",
    description: "Index home",
    inputs: {
        urls: { type: "json" },
    },
    exits: {},
    fn: async function (inputs, exits) {
        const productData = {
            title: "",
            description: "",
            images: [],
            colors: [],
        };
        const allData = []
        const fetchListingData = async () => {
            const formattedUrls = [
                'https://joyboxfactory.com/products/copy-of-power-man-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-music-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-hogwards-school-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-joker-batman-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-goku-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-man-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-deadpool-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-mandala-art-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-diamond-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-rabbit-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-lion-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-owl-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-black-widow-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-minion-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-iron-man-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-3d-moving-dna-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-lotus-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-kitty-multicolor-acrylic-3d-illusion-lamp-with-remote-1',
                'https://joyboxfactory.com/products/copy-of-kitty-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-3d-circle-multicolor-acrylic-3d-illusion-lamp-with-remote',
                'https://joyboxfactory.com/products/copy-of-teddy-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-spiderman-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-sitting-bird-scape-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-headphone-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-globe-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-elephant-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-eiffel-tower-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-dolphin-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-boat-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-3d-spiral-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-3-d-circle-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-skull-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/copy-of-skull-acrylic-led-table-lamp-1',
                'https://joyboxfactory.com/products/skull-acrylic-led-table-lamp',
                'https://joyboxfactory.com/products/3d-illusion-acrylic-table-lamp-03',
                'https://joyboxfactory.com/products/3d-illusion-acrylic-table-lamp-19',
                'https://joyboxfactory.com/products/3d-illusion-acrylic-table-lamp-8',
                'https://joyboxfactory.com/products/3d-illusion-acrylic-table-lamp-07',
                'https://joyboxfactory.com/products/3d-illusion-acrylic-table-lamp-06',
                'https://joyboxfactory.com/products/3d-illusion-acrylic-table-lamp-04',
                'https://joyboxfactory.com/products/3d-illusion-acrylic-table-lamp-02',
                'https://joyboxfactory.com/products/3d-illusion-acrylic-table-lamp-01',
            ];

            try {
                const browser = await puppeteer.launch({
                    headless: false
                });
                const page = await browser.newPage();
                for (const url of formattedUrls) {
                    await page.goto(url, { waitUntil: 'domcontentloaded' });
                    productData.title = await page.$eval('div.product__title > h1', (titleElement) => titleElement.textContent);
                    try {
                        // productData.description = await page.$eval('div.product__description.rte.quick-add-hidden > p:nth-child(3)', (descriptionElement) => descriptionElement.textContent);
                        productData.description = await page.evaluate(() => {
                            const descriptionElement = document.querySelector('div.product__description.rte.quick-add-hidden > p:nth-child(3)');
                            return descriptionElement ? descriptionElement.innerHTML : '';
                        });
                    } catch (error) {
                        // productData.description = await page.$eval('div.product__description.rte.quick-add-hidden > div > p:nth-child(1)', (descriptionElement) => descriptionElement.textContent);
                        productData.description = await page.evaluate(() => {
                            const descriptionElement = document.querySelector('div.product__description.rte.quick-add-hidden > div > p:nth-child(1)');
                            return descriptionElement ? descriptionElement.innerHTML : '';
                        });
                    }
                    const imageElements = await page.$$('div > modal-opener > div.product__media.media.media--transparent > img');
                    productData.images = await Promise.all(imageElements.map(img => img.getProperty('src').then(src => src.jsonValue())));
                    const colorOptions = await page.$$('select option');
                    productData.colors = await Promise.all(colorOptions.map(colorOption => colorOption.getProperty('value').then(src => src.jsonValue())));
                    if (productData.colors.length > 0) {
                        let i = 0
                        for (const _color of productData.colors) {
                            const id = moment().unix()
                            allData.push([id, i == 0 ? "variable" : "variation", `${id}-${i}`, productData.title, 1, 0, "visible", "", productData.description, "", "", "taxable", i == 0 ? "" : "parent", 1, 45, "", 0, 0, "", "", productData.title.includes("Clock") ? 2.5 : 6, productData.title.includes("Clock") ? 5.5 : 6, 1, "", "", i == 0 ? "" : 39, "Illusion Lamp", "", "", i == 0 ? productData.images.join(", ") : "", "", "", i == 0 ? "" : `id:${id}`, "", "", "", "", "", i, i == 0 ? "Brand" : "Color", i == 0 ? "GEADOX" : _color, i == 0 ? 1 : 0, 0])
                            i++
                        }
                    } else {
                        const id = moment().unix()
                        allData.push([id, "simple", id, productData.title, 1, 0, "visible", "", productData.description, "", "", "taxable", "", 1, 45, "", 0, 0, "", "", productData.title.includes("Clock") ? 2.5 : 6, productData.title.includes("Clock") ? 5.5 : 6, 1, "", "", 39, "Illusion Lamp", "", "", productData.images.join(", "), "", "", "", "", "", "", "", "", 0, "Brand", "GEADOX", 1])
                    }
                    console.log('Title:', productData.title);
                }
                await browser.close();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        await fetchListingData();
        allData.forEach((row) => {
            worksheet.addRow(row);
        });
        workbook.xlsx.writeFile('file.xlsx')
            .then(() => {
                console.log('Tệp Excel (XLSX) đã được tạo.');
            })
            .catch((error) => {
                console.error('Lỗi khi tạo tệp Excel (XLSX):', error);
            });

        return exits.success("data");
    }
}
