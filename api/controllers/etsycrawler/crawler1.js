const fetch = require('node-fetch');
const cheerio = require('cheerio');
const moment = require('moment');
const axios = require('axios');
const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Referer": "https://www.etsy.com/",
    // Add other headers as necessary
}
function Upper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const type1 = [
    "8X8 Inches",
    "3.54X3.54 Inches",
    "6X6 Inches",
    "3.93X3.93 Inches",
    "5X5 Inches",
    "9X9 Inches",
    "7X7 Inches",
    "5.5x5.5 Inches"
]
const price1 = [
    18,
    13.54,
    16,
    13.93,
    15,
    19,
    17,
    15.5
]
const type2 = [
    "One Side", "Two Sides"
]
const type5 = "3.07X3.07 Inches"
const type4 = [
    "One Side", "Two Sides"
]
const type3 = "5x5 Inches"

module.exports = {
    friendlyName: "Index",
    description: "Index home",
    inputs: {
        urls: { type: "json" },
    },
    exits: {},
    fn: async function (inputs, exits) {
        const { urls } = inputs;
        const data = [];
        let stt = 0
        const fetchListingData = async () => {
            for (const [index, url] of urls.entries()) {
                const id = `${moment().unix()}${index}000`
                if (index == 0) continue

                if (url[0] == 1) {
                    data.push([id, "variable", id, url[3], 1, 0, "visible", "", url[8], "", "", "taxable", "", 1, 45, "", 0, 0, "", "", "", "", 1, "", "", "", `Ornament`, "", "", url[29], "", "", "", "", "", "", "", "", 0,  "Size", type1.join(", "), 1, 0, type1[0], "Side", type2.join(", "), 1, 0, type2[0]])
                    let stt = 0
                    for (const [_index, _type1] of type1.entries()) {
                        for (const _type2 of type2) {
                            stt += 1    
                            data.push([`${parseInt(id) + stt}`, "variation", `${parseInt(id) + stt}`, url[3], 1, 0, "visible", "", "", "", "", "taxable", "parent", 1, 45, "", 0, 0, "", "", "", "", 1, "", "", _type2 == "One Side" ? price1[_index] : price1[_index] + 1.25, `Ornament`, "", "", url[29], "", "", `id:${id}`, "", "", "", "", "", stt, "Size", _type1, "", 0,"", "Side", _type2, "", 0])
                        }
                    }
                } else if (url[0] == 2 || url[0] == 4) {
                    data.push([id, "variable", id, url[3], 1, 0, "visible", "", url[8], "", "", "taxable", "", 1, 45, "", 0, 0, "", "", url[0] == 2 ? 3.54 : "", url[0] == 2 ? 3.54 : "", 1, "", "", "", `Ornament`, "", "", url[29], "", "", "", "", "", "", "", "", 0,  "Side", type2.join(", "), 1, 0, type2[0]])
                    let stt = 0
                    for (const _type2 of type2) {
                        stt += 1
                        data.push([`${parseInt(id) + stt}`, "variation", `${parseInt(id) + stt}`, url[3], 1, 0, "visible", "", "", "", "", "taxable", "parent", 1, 45, "", 0, 0, "", "", url[0] == 2 ? 3.54 : "", url[0] == 2 ? 3.54 : "", 1, "", "", _type2 == "One Side" ? 14.99 : 16.99, `Ornament`, "", "", url[29], "", "", `id:${id}`, "", "", "", "", "", stt, "Side", _type2, "", 0])
                    }
                }
                else {
                    data.push([id, "simple", id, url[3], 1, 0, "visible", "", url[8], "", "", "taxable", "", 1, 45, "", 0, 0, "", "", url[0] == 3 ? 5 : 3.07, url[0] == 3 ? 5 : 3.07, 1, "", "", url[0] == 3 ? 19.99 : 15.25, `Ornament`, "", "", url[29], "", "", "", "", "", "", "", "", 0,   "Size", url[0] == 3 ? type3 : type5, 1, 1, ""])
                }
            }
        }
        await fetchListingData()
        return exits.success(data);
    },
};
