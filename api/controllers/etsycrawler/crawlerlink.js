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
            const description = `<div class="product__description-html"><p>With a customized dog shirt, you can create a custom dog face shirt to make a unique t-shirt just for you.&nbsp;</p><ul><li>Retail fit</li><li>100% Soft cotton (fiber content may vary for different colors)</li><li>Light fabric</li><li>Tear away label</li><li>Runs true to size</li></ul><p>Our t-shirt feels soft and light, with just the right amount of stretch. It's comfortable, and the unisex cut is flattering for both men and women.<br><br>100% cotton, soft (fiber content may vary for different colors such as light colors). Environmentally-friendly manufactured cotton that gives a thicker vintage feel to the shirt. A long-lasting garment was suitable for everyday use.<br><br>Wide range of sizes from S to 5XL for most of colour. This is a standard unisex tee which is suitable for all people. Customers should order your regular apparel to have a best fit one.<br><br><strong>Preservation:</strong>&nbsp;Always, always turn the shirt inside out when washing. Don't wash the tee at a hot temperature. If you can, wash the garment on a delicate cycle and with a delicate but effective detergent. Use fabric softener or dryer sheets when washing. Fold your T-shirts after washing them.</p><h2>CUSTOM YOUR T-SHIRT IN THREE SIMPLE STEPS</h2><ol><li><strong>Customize your art.</strong>&nbsp;Choose&nbsp;styles, sizes, and colors option.</li><li><strong>Upload your pet's photo.</strong> Choose a photo of your lovely dog or cat (or any pet) from your library, your camera roll, or your computer and upload with your order.</li><li><strong>Place your order.</strong>&nbsp;After&nbsp;3-7 business days, you will receive a preview of which readies for design proof.</li></ol><h3><strong>PHOTO GUIDELINES</strong></h3><ul><li>Take your pet photo at eye level with your pet.</li><li>It works best if the pet is looking at the camera.</li><li>Try to make it a close-up so that we can see your pets unique features.</li><li>Outdoor natural daylight always results in the best photos. Try to avoid bad lighting!</li><li>Avoid uploading blurry photos.</li><li>Make sure no ears are out of frame.</li></ul><p><strong>Note</strong>: We use the exact photo you upload with your order during our artwork creation process. We dont change your uploaded photo; only&nbsp;fix it to fit your chosen style.</p><p>After receiving your order, if your photo doesnt follow the guideline, we offer replacements in that case via your email, so please keep an eye on your mailbox in the next 2 days. After 2 business days without feedback from you, we will cancel that order and get your money back. So please take your time to take a good photo to save time for both you and us.</p><h3><strong>GOOD EXAMPLE</strong></h3><ul><li>Facing forward</li><li>Well-lit with natural lighting or in a bright room</li><li>Face is visible</li><li>Neck is visible</li></ul><p><img data-src="https://img.thesitebase.net/files/10318254/2022/05/31/16539628872796e797f9.jpeg" alt="" width="100%" height="100%"></p><h3><strong>BAD EXAMPLE</strong></h3><ul><li>Angled face</li><li>Poor lighting (backlit)</li><li>The ear is cut off</li><li>Not facing forward</li><li>Not at eye level with pet</li><li>Body not visible</li><li>Pet is lying down</li><li>Blurry photo</li></ul><p><img data-src="https://img.thesitebase.net/files/10318254/2022/05/31/1653962553688ff1c1a9.jpeg" alt="" width="100%" height="100%"></p></div>`
            for (let i = 1; i <= 47; i++) {
                const apiUrl = `https://gearcape.com/api/catalog/next/products.json?page=${i}&limit=12&sort_direction=desc&sort_field=manual&minimal=true&infinite=true&collection_ids=86736271890`;

                const response = await fetch(apiUrl, {
                    method: 'GET',
                });
                const body = await response.json();
                const data = body.result.items
                for (let _data of data) {
                    const title = _data.title
                    const image = _data.images.map(images => images.src);
                    const price = _data.price
                    console.log(image,price)

                    allData.push(["T-shirts (601302)", null, title, description, "0.45", "3", "10", 10, null, "UPC (3)", null, "S", "White", null, price, "50", `${moment().unix()}${i}`, image?.[0] || null, image?.[1] || null, image?.[2] || null, image?.[3] || null, image?.[4] || null, image?.[5] || null, image?.[6] || null, image?.[7] || null, image?.[8] || null, "https://crawleretsy.nyc3.digitaloceanspaces.com/fe3fd85de2294c7a873a534f8719601a~tplv-omjb5zjo8w-origin-jpeg.jpeg", null, null, null, null, null, null, null, null, null, null, null, "Active"])
                }
            }
        }
        await fetchListingData();
        const stream = fs.createWriteStream('data1.csv');
        const csvStream = csv.format({ headers: false });
        csvStream.pipe(stream);
        allData.forEach(row => csvStream.write(row));
        csvStream.end();
        stream.on('finish', async () => {
            const filePath = 'data1.csv';
            fs.renameSync('data1.csv', filePath);
            return exits.success({ status: 0 });
        });
        return exits.success(allData);
    }
}