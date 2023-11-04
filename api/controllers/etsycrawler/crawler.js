const fetch = require('node-fetch');
const cheerio = require('cheerio');

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Referer": "https://www.etsy.com/",
    // Add other headers as necessary
}

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

        // const fetchListingData = async (url) => {
        //   try {
        //     const response = await fetch(url, {
        //       method: 'GET',
        //       headers: {
        //         ...headers,
        //         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        //         "accept-language": "vi,en;q=0.9",
        //         "cache-control": "max-age=0",
        //         "sec-ch-device-memory": "8",
        //         "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
        //         "sec-ch-ua-arch": "\"x86\"",
        //         "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"119.0.6045.105\", \"Chromium\";v=\"119.0.6045.105\", \"Not?A_Brand\";v=\"24.0.0.0\"",
        //         "sec-ch-ua-mobile": "?0",
        //         "sec-ch-ua-model": "\"\"",
        //         "sec-ch-ua-platform": "\"Windows\"",
        //         "sec-fetch-dest": "document",
        //         "sec-fetch-mode": "navigate",
        //         "sec-fetch-site": "none",
        //         "sec-fetch-user": "?1",
        //         "upgrade-insecure-requests": "1",
        //         "cookie": "uaid=n-ATjjmPrTz-qwzPzrUDeXSPnXVjZACCVGfuszC6Wqk0MTNFyUopz92pNLci0yXZ36zc2dAvtzg_3NvP1SA1MjGtSqmWAQA.; fve=1698892749.0; _fbp=fb.1.1698892749920.5705227143492975; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.1404246717.1698892751; _ga=GA1.1.535387908.1698892752; lantern=fada988f-6d07-4a44-ac49-2ee41098bacd; _pin_unauth=dWlkPU9UZ3dPVEV4TldFdE1EUXdZeTAwTnpBekxXSTVObU10WmpFM1pEUXhZMk5oTWpsaw; __pdst=c90a8b993fbe414f967a91a5b9870905; _tt_enable_cookie=1; _ttp=ZWrDUlg5mURnIW5Oqk6TfNbflNZ; user_prefs=-MouoA_h2hLX1fXVoCv_3cHtD_ZjZACCVGfusxA6dnq0Umiwi5JOXmlOjo5Sap5uaLCSjhKIAIsYQShcRCwDAA..; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FCuTeesCustomShirts; datadome=fI19yTAn~rVbBrMLDuHLtM5wkq~4RapE_Eo_cwowGaDbJvLJBHrCWitrJrzSpu_ZSaou95lNdmAH6yPDSMDOtWLPmx9MxqrdP7_czX7F1Ll1Oj4~d8_DrOcRG~1tL~b9; _uetsid=012f0320792911ee855229bbd98faa9b; _uetvid=012f33e0792911ee94c769eb9dc5716d; _ga_KR3J610VYM=GS1.1.1699060573.11.0.1699060574.59.0.0; granify.uuid=32949934-910a-450b-ad19-b5dad171e976; granify.new_user.qivBM=false; granify.session.qivBM=-1"
        //       }, referrerPolicy: "strict-origin-when-cross-origin", body: null
        //     });
        //     if (!response.ok) {
        //       throw new Error(`Request failed with status ${response.status}`);
        //     }
        //     const body = await response.text();
        //     const $ = await cheerio.load(body);
        //     const listingId = $('[data-listing-id]').attr('data-listing-id');
        //     const titleSelector = "#listing-page-cart > div:nth-child(4) > h1";
        //     const descriptionSelector = "#wt-content-toggle-product-details-read-more > p";
        //     const imageSelector = ".carousel-image";
        //     const title = $(titleSelector).text().trim();
        //     const description = $(descriptionSelector).text().trim();
        //     const image = [];
        //     $(imageSelector).each((index, element) => {
        //       let img = $(element).attr("src") || $(element).attr("data-src-zoom-image");
        //       image.push(img);
        //     });
        //     data.push(["T-shirts (601302)", "", title, description, "0.45", "3", "10", "10", "Default", "UPC (3)", "", "S", "White", "", 18, "400", listingId, image?.[0] || "", image?.[1] || "", image?.[2] || "", image?.[3] || "", image?.[4] || "", image?.[5] || "", image?.[6] || "", image?.[7] || "", image?.[8] || "", "https://p16-oec-ttp.tiktokcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/fe3fd85de2294c7a873a534f8719601a~tplv-omjb5zjo8w-origin-jpeg.jpeg?from=522366036&height=800&width=800", "", "", "", "", "", "", "", "", "", "", "", "Active"])
        //     // console.log(title, "\n", description, "\n", listingId, image);
        //   } catch (error) {
        //     console.error("Request failed:", error.message);
        //   }
        // };
        const fetchListingData = async (url) => {
            let title, description, image, listingId;
            let retries = 3; // Số lần thử lại tối đa

            while (retries > 0) {
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            ...headers,
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "vi,en;q=0.9",
                            "cache-control": "max-age=0",
                            "sec-ch-device-memory": "8",
                            "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                            "sec-ch-ua-arch": "\"x86\"",
                            "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"119.0.6045.105\", \"Chromium\";v=\"119.0.6045.105\", \"Not?A_Brand\";v=\"24.0.0.0\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-model": "\"\"",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "none",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1",
                            "cookie": "uaid=n-ATjjmPrTz-qwzPzrUDeXSPnXVjZACCVGfuszC6Wqk0MTNFyUopz92pNLci0yXZ36zc2dAvtzg_3NvP1SA1MjGtSqmWAQA.; fve=1698892749.0; _fbp=fb.1.1698892749920.5705227143492975; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.1404246717.1698892751; _ga=GA1.1.535387908.1698892752; lantern=fada988f-6d07-4a44-ac49-2ee41098bacd; _pin_unauth=dWlkPU9UZ3dPVEV4TldFdE1EUXdZeTAwTnpBekxXSTVObU10WmpFM1pEUXhZMk5oTWpsaw; __pdst=c90a8b993fbe414f967a91a5b9870905; _tt_enable_cookie=1; _ttp=ZWrDUlg5mURnIW5Oqk6TfNbflNZ; user_prefs=-MouoA_h2hLX1fXVoCv_3cHtD_ZjZACCVGfusxA6dnq0Umiwi5JOXmlOjo5Sap5uaLCSjhKIAIsYQShcRCwDAA..; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FCuTeesCustomShirts; datadome=fI19yTAn~rVbBrMLDuHLtM5wkq~4RapE_Eo_cwowGaDbJvLJBHrCWitrJrzSpu_ZSaou95lNdmAH6yPDSMDOtWLPmx9MxqrdP7_czX7F1Ll1Oj4~d8_DrOcRG~1tL~b9; _uetsid=012f0320792911ee855229bbd98faa9b; _uetvid=012f33e0792911ee94c769eb9dc5716d; _ga_KR3J610VYM=GS1.1.1699060573.11.0.1699060574.59.0.0; granify.uuid=32949934-910a-450b-ad19-b5dad171e976; granify.new_user.qivBM=false; granify.session.qivBM=-1"
                        }, referrerPolicy: "strict-origin-when-cross-origin", body: null
                    });

                    if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`);
                    }

                    const body = await response.text();
                    const $ = await cheerio.load(body);
                    listingId = $('[data-listing-id]').attr('data-listing-id');
                    const titleSelector = "#listing-page-cart > div:nth-child(4) > h1";
                    const descriptionSelector = "#wt-content-toggle-product-details-read-more > p";
                    const imageSelector = ".carousel-image";
                    title = $(titleSelector).text().trim();
                    description = $(descriptionSelector).text().trim();
                    image = [];
                    $(imageSelector).each((index, element) => {
                        let img = $(element).attr("src") || $(element).attr("data-src-zoom-image");
                        image.push(img);
                    });

                    if (title && description && image.length > 0) {
                        // Nếu có title, description và ít nhất một hình ảnh, thoát khỏi vòng lặp
                        break;
                    }
                } catch (error) {
                    console.error("Request failed:", error.message);
                }

                retries--;
            }

            if (retries === 0) {
                console.error("Exceeded maximum retries. Unable to fetch valid data.");
                return;
            }

            // Sau khi vòng lặp kết thúc và có dữ liệu hợp lệ, bạn có thể sử dụng dữ liệu ở đây
            data.push(["T-shirts (601302)", "", title, description, "0.45", "3", "10", "10", "Default", "UPC (3)", "", "S", "White", "", 18, "400", listingId, image?.[0] || "", image?.[1] || "", image?.[2] || "", image?.[3] || "", image?.[4] || "", image?.[5] || "", image?.[6] || "", image?.[7] || "", image?.[8] || "", "https://p16-oec-ttp.tiktokcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/fe3fd85de2294c7a873a534f8719601a~tplv-omjb5zjo8w-origin-jpeg.jpeg?from=522366036&height=800&width=800", "", "", "", "", "", "", "", "", "", "", "", "Active"])
        }
        await Promise.all(urls.map(url => fetchListingData(url)));
        return exits.success(data);
    },
};
